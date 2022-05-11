import { repository } from '../../database/Repository';
import { Room } from '../../domain/Room';
import request from 'supertest';

import { app } from '../../app';
import { ForecastRequest, PlayRequest } from '../GameController';
import { Card } from '../../domain/Deck';
import { BusinessErrorResponse } from '../response/BusinessErrorResponse';
import { GamePlayer } from '../../domain/GamePlayer';
import { checkBusinessError, getGamePlayer } from './__utils__/TestHelper';

describe('play', () => {

  const path = '/salas/jogar';

  const sendRequest = async (req: PlayRequest) => {
    return await request(app).post(path).send(req);
  };

  it('should play card current player',async () => {
    const room = setupGame();

    let playerCards: Card[] = [];
    const player = room.currentPlayer;
    expect(player).not.toBeUndefined();
    expect(player).toEqual(room.players[1]);
    if (player) {
      playerCards = room.currentGame?.findGamePlayer(player)?.cards ?? [];      
    }
    const oldCards = [...playerCards].map((c) => c.toString());

    const body : PlayRequest = {
      nome: player?.name ?? '',
      senha: '123',
      posicaoCarta: 0
    };

    const result = await sendRequest(body);

    expect(result.status).toBe(200);
    expect(result.body.cartas).toHaveLength(2);
    expect(result.body.cartas).toEqual([oldCards[1], oldCards[2]]);

    expect(room.currentPlayer).not.toBeUndefined();
    expect(room.currentPlayer).not.toEqual(player);
    expect(room.currentPlayer).toEqual(room.players[2]);
  });

  it('should not play card not current player',async () => {
    const room = setupGame();

    const player1 = room.players[0];

    let playerCards: Card[] = [];
    expect(room.currentPlayer).not.toBeUndefined();
    const otherPlayer = room.currentGame?.findGamePlayer(player1);

    if (otherPlayer) {
      playerCards = otherPlayer.cards;
    }
    
    const oldCards = [...playerCards].map((c) => c.toString());

    const body : PlayRequest = {
      nome: player1.name,
      senha: '123',
      posicaoCarta: 0
    };

    const result = await sendRequest(body);

    expect(result.status).toBe(200);
    expect(result.body.cartas).toHaveLength(3);
    expect(result.body.cartas).toEqual(oldCards);
  });


  it('should not play card invalid card position (negative)',async () => {
    const room = setupGame();

    expect(room.currentPlayer).not.toBeUndefined();

    const body : PlayRequest = {
      nome: room.currentPlayer?.name ?? '',
      senha: '123',
      posicaoCarta: -1
    };

    const result = await sendRequest(body);

    expect(result.status).toBe(400);
    expect(result.body.message).toEqual('Invalid card position -1');
  });

  it('should not play card invalid card position (beyond limit)',async () => {
    const room = setupGame();

    expect(room.currentPlayer).not.toBeUndefined();

    const body : PlayRequest = {
      nome: room.currentPlayer?.name ?? '',
      senha: '123',
      posicaoCarta: 10
    };

    const result = await sendRequest(body);

    const errorParams = new Map<string, string>([
      ['position', '10'],
      ['size', '3']
    ]);
    checkBusinessError(result, new BusinessErrorResponse('InvalidCardPositionError', 'Position [10] at hand with size [3] is invalid!', errorParams));
  });

  it('should not play card player not found',async () => {
    const room = setupGame();

    expect(room.currentPlayer).not.toBeUndefined();

    const body : PlayRequest = {
      nome: 'Abacaxi',
      senha: '123',
      posicaoCarta: 0
    };

    const result = await sendRequest(body);

    const errorParams = new Map<string, string>([
      ['playerName', 'Abacaxi']
    ]);
    checkBusinessError(result, new BusinessErrorResponse('PlayerNotFoundError', 'Player with name [Abacaxi] not found!', errorParams));
  });

  it('should not play card invalid password',async () => {
    const room = setupGame();

    expect(room.currentPlayer).not.toBeUndefined();

    const body : PlayRequest = {
      nome: room.currentPlayer?.name ?? '',
      senha: '1234',
      posicaoCarta: 0
    };

    const result = await sendRequest(body);

    const errorParams = new Map<string, string>([
      ['playerName', room.currentPlayer?.name ?? '']
    ]);
    checkBusinessError(result, new BusinessErrorResponse('PlayerNotFoundError', 'Player with name [' + room.currentPlayer?.name + '] not found!', errorParams));
  });

  it('should not play card game not forecasted',async () => {
    const room = setupGame(true, false);

    expect(room.currentPlayer).not.toBeUndefined();
    expect(room.currentGame?.isForecasted).toBeFalsy();

    const body : PlayRequest = {
      nome: room.currentPlayer?.name ?? '',
      senha: '123',
      posicaoCarta: 0
    };

    const result = await sendRequest(body);

    checkBusinessError(result, new BusinessErrorResponse('GameNotForecastedError', 'Game is not forecasted!', new Map()));
  });

  it('should not play card game not started',async () => {
    const room = setupGame(false);

    expect(room.currentPlayer).toBeUndefined();
    expect(room.currentGame).toBeUndefined();

    const body : PlayRequest = {
      nome: room.players[1].name,
      senha: '123',
      posicaoCarta: 0
    };

    const result = await sendRequest(body);

    checkBusinessError(result, new BusinessErrorResponse('GameNotStartedError', 'Game has not been started!', new Map()));
  });
});

describe('forecast', () => {

  const path = '/salas/previsao';

  const sendRequest = async (req: ForecastRequest) => {
    return await request(app).post(path).send(req);
  };

  const validateForecastedSuccessResponse = (result: request.Response, gamePlayer: GamePlayer | undefined, forecast?: number, restriction?: number) => {
    expect(gamePlayer).not.toBeUndefined();
    expect(result.status).toBe(200);
    expect(result.body.nome).toEqual(gamePlayer?.player?.name);
    expect(result.body.cartas).toEqual(gamePlayer?.cards.map((c) => c.toString()));
    expect(result.body.dealer).toEqual(restriction !== undefined);
    expect(result.body.admin).toEqual(false);
    expect(result.body.jogadorAtual).toEqual(false);
    expect(result.body.perguntarPrevisao).toEqual(false);
    expect(result.body.restricaoPrevisao).toBeUndefined();
    expect(result.body.previsao).toEqual(forecast);
  };

  it('should forecast current player',async () => {
    const room = setupGameNotForecasted();

    const player = room.currentPlayer;
    expect(player).not.toBeUndefined();
    expect(player).toEqual(room.players[1]);

    const gamePlayer = getGamePlayer(room);
    expect(gamePlayer).not.toBeUndefined();

    const body : ForecastRequest = {
      nome: player?.name ?? '',
      senha: '123',
      quantidade: 2
    };

    const result = await sendRequest(body);

    validateForecastedSuccessResponse(result, gamePlayer, 2);

    expect(room.currentPlayer).not.toBeUndefined();
    expect(room.currentPlayer).not.toEqual(player);
    expect(room.currentPlayer).toEqual(room.players[2]);
  });

  it('should not forecast not current player',async () => {
    const room = setupGameNotForecasted();

    const player1 = room.players[2];

    expect(room.currentPlayer).not.toBeUndefined();
    const gamePlayer = getGamePlayer(room, player1);
    expect(gamePlayer).not.toBeUndefined();

    const body : ForecastRequest = {
      nome: player1.name,
      senha: '123',
      quantidade: 2
    };

    const result = await sendRequest(body);

    validateForecastedSuccessResponse(result, gamePlayer);
    expect(room.currentPlayer).not.toBeUndefined();
    expect(room.currentPlayer).not.toEqual(player1);
    expect(room.currentPlayer).toEqual(room.players[1]);
  });

  it('should not forecast invalid value (negative)',async () => {
    const room = setupGameNotForecasted();

    expect(room.currentPlayer).not.toBeUndefined();

    const body : ForecastRequest = {
      nome: room.currentPlayer?.name ?? '',
      senha: '123',
      quantidade: -1
    };

    const result = await sendRequest(body);

    expect(result.status).toBe(400);
    expect(result.body.message).toEqual('Invalid quantity value -1');
  });

  it('should not forecast invalid value (beyond limit)',async () => {
    const room = setupGameNotForecasted();

    expect(room.currentPlayer).not.toBeUndefined();

    const playerName = room.currentPlayer?.name ?? '';

    const body : ForecastRequest = {
      nome: playerName,
      senha: '123',
      quantidade: 10
    };

    const result = await sendRequest(body);

    const errorParams = new Map<string, string>([
      ['playerName', playerName],
      ['forecast', '10']
    ]);
    checkBusinessError(result, new BusinessErrorResponse('ForecastNotAllowedError', 'Forecast not allowed for player ' + playerName + ' - 10!', errorParams));
  });

  it('should not forecast with restriction and value restricted',async () => {
    const room = setupGameNotForecasted();

    room.setForecast(room.players[1], 2);
    room.setForecast(room.players[2], 0);

    expect(room.currentPlayer).not.toBeUndefined();

    const playerName = room.currentPlayer?.name ?? '';

    const body : ForecastRequest = {
      nome: playerName,
      senha: '123',
      quantidade: 1
    };

    const result = await sendRequest(body);

    const errorParams = new Map<string, string>([
      ['playerName', playerName],
      ['forecast', '1']
    ]);
    checkBusinessError(result, new BusinessErrorResponse('ForecastNotAllowedError', 'Forecast not allowed for player ' + playerName + ' - 1!', errorParams));
  });

  it('should forecast with restriction and below value restricted',async () => {
    const room = setupGameNotForecasted();

    room.setForecast(room.players[1], 2);
    room.setForecast(room.players[2], 0);

    expect(room.currentPlayer).not.toBeUndefined();

    const playerName = room.currentPlayer?.name ?? '';

    const body : ForecastRequest = {
      nome: playerName,
      senha: '123',
      quantidade: 0
    };

    const result = await sendRequest(body);
    validateForecastedSuccessResponse(result, room.currentGame?.findGamePlayer(room.players[0]), 0, 1);
  });

  it('should forecast with restriction and above value restricted',async () => {
    const room = setupGameNotForecasted();

    room.setForecast(room.players[1], 2);
    room.setForecast(room.players[2], 0);

    expect(room.currentPlayer).not.toBeUndefined();

    const playerName = room.currentPlayer?.name ?? '';

    const body : ForecastRequest = {
      nome: playerName,
      senha: '123',
      quantidade: 2
    };

    const result = await sendRequest(body);
    validateForecastedSuccessResponse(result, room.currentGame?.findGamePlayer(room.players[0]), 2, 1);
  });

  it('should not forecast player not found',async () => {
    const room = setupGameNotForecasted();

    expect(room.currentPlayer).not.toBeUndefined();

    const body : ForecastRequest = {
      nome: 'Abacaxi',
      senha: '123',
      quantidade: 0
    };

    const result = await sendRequest(body);

    const errorParams = new Map<string, string>([
      ['playerName', 'Abacaxi']
    ]);
    checkBusinessError(result, new BusinessErrorResponse('PlayerNotFoundError', 'Player with name [Abacaxi] not found!', errorParams));
  });

  it('should not forecast invalid password',async () => {
    const room = setupGameNotForecasted();

    expect(room.currentPlayer).not.toBeUndefined();
    const playerName = room.currentPlayer?.name ?? '';

    const body : ForecastRequest = {
      nome: playerName,
      senha: '1234',
      quantidade: 0
    };

    const result = await sendRequest(body);

    const errorParams = new Map<string, string>([
      ['playerName', playerName]
    ]);
    checkBusinessError(result, new BusinessErrorResponse('PlayerNotFoundError', 'Player with name [' + playerName + '] not found!', errorParams));
  });
  
  it('should not forecast game not started',async () => {
    const room = setupGame(false);

    expect(room.currentPlayer).toBeUndefined();
    expect(room.currentGame).toBeUndefined();

    const body : ForecastRequest = {
      nome: room.players[1].name,
      senha: '123',
      quantidade: 0
    };

    const result = await sendRequest(body);

    checkBusinessError(result, new BusinessErrorResponse('GameNotStartedError', 'Game has not been started!'));
  });
});

function setupGameNotForecasted() : Room {
  return setupGame(true, false);
}

function setupGame(_start?:boolean, _forecast?:boolean) : Room {
  const start = _start ?? true;
  const forecast = start  && (_forecast ?? true);

  const room = new Room();
  
  room.join('PlayerOne', '123');
  room.join('PlayerTwo', '123');
  room.join('PlayerThr', '123');

  if (start)
    room.scramble(3);

  if (forecast) {
    room.setForecast(room.players[1], 2);
    room.setForecast(room.players[2], 2);
    room.setForecast(room.players[0], 2);
  }
  repository.currentRoom = room;
  return room;
}
