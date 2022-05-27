import { repository } from '../../database/Repository';
import { Room } from '../../domain/Room';
import request from 'supertest';

import { app } from '../../app';
import { BusinessErrorResponse } from '../response/BusinessErrorResponse';
import {
  checkBusinessError,
  checkInvalidRequestError,
} from './__utils__/TestHelper';
import { AuthenticatedRequest } from '../request/AuthenticatedRequest';
import { Deck } from '../../domain/Deck';

describe('finishRound', () => {
  const path = '/salas/setarGanhador';

  const sendRequest = async (req?: AuthenticatedRequest) => {
    return await request(app).post(path).send(req);
  };

  it('should not set winner invalid payload empty', async () => {
    const room = new Room();
    repository.currentRoom = room;

    const result = await sendRequest();

    checkInvalidRequestError(result, 'Invalid auth request');
  });

  it('should not set winner for empty room', async () => {
    const room = new Room();

    repository.currentRoom = room;

    const body: AuthenticatedRequest = {
      nome: 'Abacaxi',
      senha: '123',
    };

    const result = await sendRequest(body);

    checkBusinessError(
      result,
      new BusinessErrorResponse('RoomIsEmptyError', 'Room is empty!')
    );
  });

  it('should not set winner game not started', async () => {
    const room = new Room();

    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');

    repository.currentRoom = room;

    const body: AuthenticatedRequest = {
      nome: room.players[0].name,
      senha: '123',
    };

    const result = await sendRequest(body);

    checkBusinessError(
      result,
      new BusinessErrorResponse(
        'GameNotStartedError',
        'Game has not been started!'
      )
    );
  });

  it('should not set winner game not forecasted', async () => {
    const room = new Room();

    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');

    room.scramble(3);

    repository.currentRoom = room;

    const body: AuthenticatedRequest = {
      nome: room.players[0].name,
      senha: '123',
    };

    const result = await sendRequest(body);

    checkBusinessError(
      result,
      new BusinessErrorResponse(
        'GameNotForecastedError',
        'Game is not forecasted!'
      )
    );
  });

  it('should not set winner empty desk', async () => {
    const room = new Room();

    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');

    room.scramble(3);

    room.setForecast(room.players[1], 2);
    room.setForecast(room.players[0], 2);

    repository.currentRoom = room;

    const body: AuthenticatedRequest = {
      nome: room.players[0].name,
      senha: '123',
    };

    const result = await sendRequest(body);

    expect(room.currentGame?.isForecasted).toBeTruthy();

    const errorParams = new Map<string, string>([
      ['notPlayedSize', '2'],
      ['deskSize', '0'],
      ['allPlayersSize', '2'],
    ]);
    checkBusinessError(
      result,
      new BusinessErrorResponse(
        'DeskNotCompletedError',
        'Players not played 2 with desk size [0] and allPlayers size [2]',
        errorParams
      )
    );
  });

  it('should not set winner if any player has not played', async () => {
    const room = new Room();

    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');

    room.scramble(3);

    room.setForecast(room.players[1], 2);
    room.setForecast(room.players[0], 2);

    if (room.currentPlayer) {
      room.playCard(room.currentPlayer, 0);
    } else {
      throw Error('should have currentPlayer');
    }

    repository.currentRoom = room;

    const body: AuthenticatedRequest = {
      nome: room.players[0].name,
      senha: '123',
    };

    const result = await sendRequest(body);

    expect(room.currentGame?.isForecasted).toBeTruthy();
    expect(room.currentPlayer).toBe(room.players[0]);

    const errorParams = new Map<string, string>([
      ['notPlayedSize', '1'],
      ['deskSize', '1'],
      ['allPlayersSize', '2'],
    ]);
    checkBusinessError(
      result,
      new BusinessErrorResponse(
        'DeskNotCompletedError',
        'Players not played 1 with desk size [1] and allPlayers size [2]',
        errorParams
      )
    );
  });

  it('should have a winner', async () => {
    const cards = [
      '2♣r', // wildcard
      'A♦r',
      'K♠b',
      'Q♠b',
      'J♠b', // player 0
      '10♠b',
      '9♠b',
      '8♠b',
      '7♠b', // player 1
      '6♠b',
      '5♠b',
      '4♠b',
      '3♠b', // player 2

      '2♠b',
      'A♠b',
      '3♠r',
      '9♠r',
      '10♠r',
      '2♠r',
      '5♦b',
      '8♦b',
      '10♦b',
      '2♣r',
      'A♣r',
      '5♣r',
      '3♣r',
      '3♣b',
      'J♣r',
      '2♥b',
      '2♥r',
      '3♥b',
      'A♥b',
      'J♥b',
      '5♥r',
      '9♥r',
      '10♥r',
    ];

    const spiedDeck = jest.spyOn(Deck, 'getScrambled');
    spiedDeck.mockReturnValueOnce([...cards]);

    const room = new Room();

    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');
    room.join('PlayerThree', '123');

    room.scramble(4);

    room.setForecast(room.players[1], 2);
    room.setForecast(room.players[2], 2);
    room.setForecast(room.players[0], 2);

    if (room.currentPlayer) {
      room.playCard(room.currentPlayer, 0); // player1 10♠b
      room.playCard(room.currentPlayer, 0); // player2 3♠b
      room.playCard(room.currentPlayer, 0); // player0 A♦r
    } else {
      throw Error('should have currentPlayer');
    }
    repository.currentRoom = room;

    const expectedWinner = room.players[0]; // player0 A♦r

    // when
    const body: AuthenticatedRequest = {
      nome: room.players[0].name,
      senha: '123',
    };

    const result = await sendRequest(body);

    // then
    expect(result.status).toBe(200);
    expect(result.body.nome).toEqual(expectedWinner.name);
    expect(room.currentGame?.isForecasted).toBeTruthy();
    expect(room.currentPlayer).toBe(expectedWinner);
  });
});
