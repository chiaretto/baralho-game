import { repository } from '../../database/Repository';
import { Room } from '../../domain/Room';
import request from 'supertest';

import { app } from '../../app';
import { BusinessErrorResponse } from '../response/BusinessErrorResponse';
import {
  checkBusinessError,
  checkInvalidRequestError,
} from './__utils__/TestHelper';
import { RoundRequest } from '../request/GameControllerRequests';
import { Game } from '../../domain/Game';
import { Player } from '../../domain/Player';

describe('scramble', () => {
  const scramblePath = '/salas/embaralhar';

  const sendScrambleRequest = async (req: RoundRequest) => {
    return await request(app).post(scramblePath).send(req);
  };

  it('should not scramble an empty payload', async () => {
    const room = new Room();

    repository.currentRoom = room;

    const result = await request(app).post(scramblePath).send();

    checkInvalidRequestError(result, 'Invalid auth request');

    expect(room.closed).toBeFalsy();
    expect(room.currentPlayer).toBeUndefined();
    expect(room.currentGame).toBeUndefined();
  });

  it('should not scramble in an empty room', async () => {
    const room = new Room();

    repository.currentRoom = room;

    const result = await sendScrambleRequest({
      nome: '123',
      senha: '123',
      quantidade: 3,
    });

    checkBusinessError(
      result,
      new BusinessErrorResponse('RoomIsEmptyError', 'Room is empty!')
    );

    expect(room.closed).toBeFalsy();
    expect(room.currentPlayer).toBeUndefined();
    expect(room.currentGame).toBeUndefined();
  });

  it('should not scramble negative amount of cards', async () => {
    const room = new Room();

    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');

    repository.currentRoom = room;

    const reqBody: RoundRequest = {
      quantidade: -1,
      nome: 'PlayerOne',
      senha: '123',
    };
    const result = await sendScrambleRequest(reqBody);

    expect(result.status).toBe(200);
    expect(result.body.embaralhado).toBeFalsy();

    expect(room.closed).toBeFalsy();
    expect(room.currentPlayer).toBeUndefined();
    expect(room.currentGame).toBeUndefined();
  });

  it('should not scramble zero cards', async () => {
    const room = new Room();

    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');

    repository.currentRoom = room;

    const reqBody: RoundRequest = {
      quantidade: 0,
      nome: 'PlayerOne',
      senha: '123',
    };
    const result = await sendScrambleRequest(reqBody);

    expect(result.status).toBe(200);
    expect(result.body.embaralhado).toBeFalsy();

    expect(room.closed).toBeFalsy();
    expect(room.currentPlayer).toBeUndefined();
    expect(room.currentGame).toBeUndefined();
  });

  it('should not scramble player not found', async () => {
    const room = new Room();

    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');

    repository.currentRoom = room;

    const reqBody: RoundRequest = {
      quantidade: 3,
      nome: 'PlayerOne',
      senha: '1234',
    };
    const result = await sendScrambleRequest(reqBody);

    const errorParams = new Map<string, string>([['playerName', 'PlayerOne']]);
    checkBusinessError(
      result,
      new BusinessErrorResponse(
        'PlayerNotFoundError',
        'Player with name [PlayerOne] not found!',
        errorParams
      )
    );

    expect(room.closed).toBeFalsy();
    expect(room.currentPlayer).toBeUndefined();
    expect(room.currentGame).toBeUndefined();
  });

  it('should not scramble room closed', async () => {
    const room = new Room();

    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');

    room.closed = true;
    repository.currentRoom = room;

    const reqBody: RoundRequest = {
      quantidade: 3,
      nome: 'PlayerOne',
      senha: '123',
    };
    const result = await sendScrambleRequest(reqBody);

    expect(result.status).toBe(200);
    expect(result.body.embaralhado).toBeFalsy();

    expect(room.closed).toBeTruthy();
    expect(room.currentPlayer).toBeUndefined();
    expect(room.currentGame).toBeUndefined();
  });

  it('should not scramble room scrambled', async () => {
    const room = new Room();

    const player1 = room.join('PlayerOne', '123');
    const player2 = room.join('PlayerTwo', '123');

    room.scramble(3);
    repository.currentRoom = room;

    const reqBody: RoundRequest = {
      quantidade: 3,
      nome: 'PlayerOne',
      senha: '123',
    };
    const result = await sendScrambleRequest(reqBody);

    expect(result.status).toBe(200);
    expect(result.body.embaralhado).toBeFalsy();

    expect(room.closed).toBeTruthy();
    expect(room.currentPlayer).not.toBeUndefined();
    expect(room.currentPlayer).toBe(player2);
    expect(room.currentGame).not.toBeUndefined();

    if (room.currentGame) {
      expect(room.currentGame.dealer).toBe(player1);
      expect(room.currentGame.id).toBe(3);
      expect(room.currentGame.isForecasted).toBeFalsy();
      expect(room.currentGame.wildCard).not.toBeUndefined();

      checkPlayer(room.currentGame, player1, 3);
      checkPlayer(room.currentGame, player2, 3);
    }
  });

  it('should scramble positive amount of cards', async () => {
    const room = new Room();

    const player1 = room.join('PlayerOne', '123');
    const player2 = room.join('PlayerTwo', '123');

    repository.currentRoom = room;

    const reqBody: RoundRequest = {
      quantidade: 3,
      nome: 'PlayerOne',
      senha: '123',
    };
    const result = await sendScrambleRequest(reqBody);

    expect(result.status).toBe(200);
    expect(result.body.embaralhado).toBeTruthy();

    expect(room.closed).toBeTruthy();
    expect(room.currentPlayer).not.toBeUndefined();
    expect(room.currentPlayer).toBe(player2);
    expect(room.currentGame).not.toBeUndefined();

    if (room.currentGame) {
      expect(room.currentGame.dealer).toBe(player1);
      expect(room.currentGame.id).toBe(3);
      expect(room.currentGame.isForecasted).toBeFalsy();
      expect(room.currentGame.wildCard).not.toBeUndefined();

      checkPlayer(room.currentGame, player1, 3);
      checkPlayer(room.currentGame, player2, 3);
    }
  });

  function checkPlayer(game: Game, player: Player | undefined, amount: number) {
    expect(player).not.toBeUndefined();
    if (player) {
      const gamePlayer = game.findGamePlayer(player);
      expect(gamePlayer).not.toBeUndefined();
      expect(gamePlayer?.cards).toHaveLength(amount);
      expect(gamePlayer?.forecast).toBeUndefined();
    }
  }
});
