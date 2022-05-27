import request from 'supertest';

import { app } from '../../app';
import { Card } from '../../domain/Deck';
import { BusinessErrorResponse } from '../response/BusinessErrorResponse';
import { checkBusinessError } from './__utils__/TestHelper';
import { PlayRequest } from '../request/GameControllerRequests';
import { setupGame } from './__utils__/builders/GameControllerBuilder';

describe('play', () => {
  const path = '/salas/jogar';

  const sendRequest = async (req: PlayRequest) => {
    return await request(app).post(path).send(req);
  };

  it('should play card current player', async () => {
    const room = setupGame();

    let playerCards: Card[] = [];
    const player = room.currentPlayer;
    expect(player).not.toBeUndefined();
    expect(player).toEqual(room.players[1]);
    if (player) {
      playerCards = room.currentGame?.findGamePlayer(player)?.cards ?? [];
    }
    const oldCards = [...playerCards].map((c) => c.toString());

    const body: PlayRequest = {
      nome: player?.name ?? '',
      senha: '123',
      posicaoCarta: 0,
    };

    const result = await sendRequest(body);

    expect(result.status).toBe(200);
    expect(result.body.cartas).toHaveLength(2);
    expect(result.body.cartas).toEqual([oldCards[1], oldCards[2]]);

    expect(room.currentPlayer).not.toBeUndefined();
    expect(room.currentPlayer).not.toEqual(player);
    expect(room.currentPlayer).toEqual(room.players[2]);
  });

  it('should not play card not current player', async () => {
    const room = setupGame();

    const player1 = room.players[0];

    let playerCards: Card[] = [];
    expect(room.currentPlayer).not.toBeUndefined();
    const otherPlayer = room.currentGame?.findGamePlayer(player1);

    if (otherPlayer) {
      playerCards = otherPlayer.cards;
    }

    const oldCards = [...playerCards].map((c) => c.toString());

    const body: PlayRequest = {
      nome: player1.name,
      senha: '123',
      posicaoCarta: 0,
    };

    const result = await sendRequest(body);

    expect(result.status).toBe(200);
    expect(result.body.cartas).toHaveLength(3);
    expect(result.body.cartas).toEqual(oldCards);
  });

  it('should not play card invalid card position (negative)', async () => {
    const room = setupGame();

    expect(room.currentPlayer).not.toBeUndefined();

    const body: PlayRequest = {
      nome: room.currentPlayer?.name ?? '',
      senha: '123',
      posicaoCarta: -1,
    };

    const result = await sendRequest(body);

    expect(result.status).toBe(400);
    expect(result.body.message).toEqual('Invalid card position -1');
  });

  it('should not play card invalid card position (beyond limit)', async () => {
    const room = setupGame();

    expect(room.currentPlayer).not.toBeUndefined();

    const body: PlayRequest = {
      nome: room.currentPlayer?.name ?? '',
      senha: '123',
      posicaoCarta: 10,
    };

    const result = await sendRequest(body);

    const errorParams = new Map<string, string>([
      ['position', '10'],
      ['size', '3'],
    ]);
    checkBusinessError(
      result,
      new BusinessErrorResponse(
        'InvalidCardPositionError',
        'Position [10] at hand with size [3] is invalid!',
        errorParams
      )
    );
  });

  it('should not play card player not found', async () => {
    const room = setupGame();

    expect(room.currentPlayer).not.toBeUndefined();

    const body: PlayRequest = {
      nome: 'Abacaxi',
      senha: '123',
      posicaoCarta: 0,
    };

    const result = await sendRequest(body);

    const errorParams = new Map<string, string>([['playerName', 'Abacaxi']]);
    checkBusinessError(
      result,
      new BusinessErrorResponse(
        'PlayerNotFoundError',
        'Player with name [Abacaxi] not found!',
        errorParams
      )
    );
  });

  it('should not play card invalid password', async () => {
    const room = setupGame();

    expect(room.currentPlayer).not.toBeUndefined();

    const body: PlayRequest = {
      nome: room.currentPlayer?.name ?? '',
      senha: '1234',
      posicaoCarta: 0,
    };

    const result = await sendRequest(body);

    const errorParams = new Map<string, string>([
      ['playerName', room.currentPlayer?.name ?? ''],
    ]);
    checkBusinessError(
      result,
      new BusinessErrorResponse(
        'PlayerNotFoundError',
        'Player with name [' + room.currentPlayer?.name + '] not found!',
        errorParams
      )
    );
  });

  it('should not play card game not forecasted', async () => {
    const room = setupGame(true, false);

    expect(room.currentPlayer).not.toBeUndefined();
    expect(room.currentGame?.isForecasted).toBeFalsy();

    const body: PlayRequest = {
      nome: room.currentPlayer?.name ?? '',
      senha: '123',
      posicaoCarta: 0,
    };

    const result = await sendRequest(body);

    checkBusinessError(
      result,
      new BusinessErrorResponse(
        'GameNotForecastedError',
        'Game is not forecasted!',
        new Map()
      )
    );
  });

  it('should not play card game not started', async () => {
    const room = setupGame(false);

    expect(room.currentPlayer).toBeUndefined();
    expect(room.currentGame).toBeUndefined();

    const body: PlayRequest = {
      nome: room.players[1].name,
      senha: '123',
      posicaoCarta: 0,
    };

    const result = await sendRequest(body);

    checkBusinessError(
      result,
      new BusinessErrorResponse(
        'GameNotStartedError',
        'Game has not been started!',
        new Map()
      )
    );
  });
});
