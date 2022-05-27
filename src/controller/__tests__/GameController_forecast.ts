import request from 'supertest';

import { app } from '../../app';
import { BusinessErrorResponse } from '../response/BusinessErrorResponse';
import { GamePlayer } from '../../domain/GamePlayer';
import { checkBusinessError, getGamePlayer } from './__utils__/TestHelper';
import { ForecastRequest } from '../request/GameControllerRequests';
import {
  setupGame,
  setupGameNotForecasted,
} from './__utils__/builders/GameControllerBuilder';

describe('forecast', () => {
  const path = '/salas/previsao';

  const sendRequest = async (req: ForecastRequest) => {
    return await request(app).post(path).send(req);
  };

  const validateForecastedSuccessResponse = (
    result: request.Response,
    gamePlayer: GamePlayer | undefined,
    forecast?: number,
    restriction?: number
  ) => {
    expect(gamePlayer).not.toBeUndefined();
    expect(result.status).toBe(200);
    expect(result.body.nome).toEqual(gamePlayer?.player?.name);
    expect(result.body.cartas).toEqual(
      gamePlayer?.cards.map((c) => c.toString())
    );
    expect(result.body.dealer).toEqual(restriction !== undefined);
    expect(result.body.admin).toEqual(false);
    expect(result.body.jogadorAtual).toEqual(false);
    expect(result.body.perguntarPrevisao).toEqual(false);
    expect(result.body.restricaoPrevisao).toBeUndefined();
    expect(result.body.previsao).toEqual(forecast);
  };

  it('should forecast current player', async () => {
    const room = setupGameNotForecasted();

    const player = room.currentPlayer;
    expect(player).not.toBeUndefined();
    expect(player).toEqual(room.players[1]);

    const gamePlayer = getGamePlayer(room);
    expect(gamePlayer).not.toBeUndefined();

    const body: ForecastRequest = {
      nome: player?.name ?? '',
      senha: '123',
      quantidade: 2,
    };

    const result = await sendRequest(body);

    validateForecastedSuccessResponse(result, gamePlayer, 2);

    expect(room.currentPlayer).not.toBeUndefined();
    expect(room.currentPlayer).not.toEqual(player);
    expect(room.currentPlayer).toEqual(room.players[2]);
  });

  it('should not forecast not current player', async () => {
    const room = setupGameNotForecasted();

    const player1 = room.players[2];

    expect(room.currentPlayer).not.toBeUndefined();
    const gamePlayer = getGamePlayer(room, player1);
    expect(gamePlayer).not.toBeUndefined();

    const body: ForecastRequest = {
      nome: player1.name,
      senha: '123',
      quantidade: 2,
    };

    const result = await sendRequest(body);

    validateForecastedSuccessResponse(result, gamePlayer);
    expect(room.currentPlayer).not.toBeUndefined();
    expect(room.currentPlayer).not.toEqual(player1);
    expect(room.currentPlayer).toEqual(room.players[1]);
  });

  it('should not forecast invalid value (negative)', async () => {
    const room = setupGameNotForecasted();

    expect(room.currentPlayer).not.toBeUndefined();

    const body: ForecastRequest = {
      nome: room.currentPlayer?.name ?? '',
      senha: '123',
      quantidade: -1,
    };

    const result = await sendRequest(body);

    expect(result.status).toBe(400);
    expect(result.body.message).toEqual('Invalid quantity value -1');
  });

  it('should not forecast invalid value (beyond limit)', async () => {
    const room = setupGameNotForecasted();

    expect(room.currentPlayer).not.toBeUndefined();

    const playerName = room.currentPlayer?.name ?? '';

    const body: ForecastRequest = {
      nome: playerName,
      senha: '123',
      quantidade: 10,
    };

    const result = await sendRequest(body);

    const errorParams = new Map<string, string>([
      ['playerName', playerName],
      ['forecast', '10'],
    ]);
    checkBusinessError(
      result,
      new BusinessErrorResponse(
        'ForecastNotAllowedError',
        'Forecast not allowed for player ' + playerName + ' - 10!',
        errorParams
      )
    );
  });

  it('should not forecast with restriction and value restricted', async () => {
    const room = setupGameNotForecasted();

    room.setForecast(room.players[1], 2);
    room.setForecast(room.players[2], 0);

    expect(room.currentPlayer).not.toBeUndefined();

    const playerName = room.currentPlayer?.name ?? '';

    const body: ForecastRequest = {
      nome: playerName,
      senha: '123',
      quantidade: 1,
    };

    const result = await sendRequest(body);

    const errorParams = new Map<string, string>([
      ['playerName', playerName],
      ['forecast', '1'],
    ]);
    checkBusinessError(
      result,
      new BusinessErrorResponse(
        'ForecastNotAllowedError',
        'Forecast not allowed for player ' + playerName + ' - 1!',
        errorParams
      )
    );
  });

  it('should forecast with restriction and below value restricted', async () => {
    const room = setupGameNotForecasted();

    room.setForecast(room.players[1], 2);
    room.setForecast(room.players[2], 0);

    expect(room.currentPlayer).not.toBeUndefined();

    const playerName = room.currentPlayer?.name ?? '';

    const body: ForecastRequest = {
      nome: playerName,
      senha: '123',
      quantidade: 0,
    };

    const result = await sendRequest(body);
    validateForecastedSuccessResponse(
      result,
      room.currentGame?.findGamePlayer(room.players[0]),
      0,
      1
    );
  });

  it('should forecast with restriction and above value restricted', async () => {
    const room = setupGameNotForecasted();

    room.setForecast(room.players[1], 2);
    room.setForecast(room.players[2], 0);

    expect(room.currentPlayer).not.toBeUndefined();

    const playerName = room.currentPlayer?.name ?? '';

    const body: ForecastRequest = {
      nome: playerName,
      senha: '123',
      quantidade: 2,
    };

    const result = await sendRequest(body);
    validateForecastedSuccessResponse(
      result,
      room.currentGame?.findGamePlayer(room.players[0]),
      2,
      1
    );
  });

  it('should not forecast player not found', async () => {
    const room = setupGameNotForecasted();

    expect(room.currentPlayer).not.toBeUndefined();

    const body: ForecastRequest = {
      nome: 'Abacaxi',
      senha: '123',
      quantidade: 0,
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

  it('should not forecast invalid password', async () => {
    const room = setupGameNotForecasted();

    expect(room.currentPlayer).not.toBeUndefined();
    const playerName = room.currentPlayer?.name ?? '';

    const body: ForecastRequest = {
      nome: playerName,
      senha: '1234',
      quantidade: 0,
    };

    const result = await sendRequest(body);

    const errorParams = new Map<string, string>([['playerName', playerName]]);
    checkBusinessError(
      result,
      new BusinessErrorResponse(
        'PlayerNotFoundError',
        'Player with name [' + playerName + '] not found!',
        errorParams
      )
    );
  });

  it('should not forecast game not started', async () => {
    const room = setupGame(false);

    expect(room.currentPlayer).toBeUndefined();
    expect(room.currentGame).toBeUndefined();

    const body: ForecastRequest = {
      nome: room.players[1].name,
      senha: '123',
      quantidade: 0,
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
});
