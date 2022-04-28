import { repository } from '../../database/Repository';
import { Room } from '../../domain/Room';
import request from 'supertest';

import { app } from '../../app';
import { RoomPlayerResponse } from '../response/RoomPlayerResponse';
import { Deck } from '../../domain/Deck';
import { RoomDeskItemResponse } from '../response/RoomDesktemResponse';
import { GamePlayer } from '../../domain/GamePlayer';
import { Player } from '../../domain/Player';
import { RoundRequest } from '../RoomController';
import { Game } from '../../domain/Game';

describe('showRoom', () => {

  it('show empty room',async () => {
    const room = new Room();
    repository.currentRoom = room;

    const result = await request(app).get('/salas').send();

    expect(result.status).toBe(200);
    expect(result.body.salaFechada).toBeFalsy();
    expect(result.body.curingas).toHaveLength(0);
    checkDeskResponse(result, []);
    checkPlayerResponse(result, []);
  });

  it('show room with 2 new players',async () => {
    // given
    const room = new Room();
    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');

    const player1Response = new RoomPlayerResponse(room.players[0], room);
    const player2Response = new RoomPlayerResponse(room.players[1], room);

    player1Response.admin = false;
    player1Response.dealer = false;
    player1Response.jogadorAtual = false;
    player1Response.nome = 'PlayerOne';
    player1Response.pontosRodada = 0;
    player1Response.pontosTotal = 0;
    player1Response.previsaoRodada = 0;
    player1Response.quantidadeCartas = 0;

    player2Response.admin = false;
    player2Response.dealer = false;
    player2Response.jogadorAtual = false;
    player2Response.nome = 'PlayerTwo';
    player2Response.pontosRodada = 0;
    player2Response.pontosTotal = 0;
    player2Response.previsaoRodada = 0;
    player2Response.quantidadeCartas = 0;

    repository.currentRoom = room;

    // when
    const result = await request(app).get('/salas').send();

    // then
    expect(result.status).toBe(200);
    expect(result.body.salaFechada).toBeFalsy();
    expect(result.body.curingas).toHaveLength(0);
    checkDeskResponse(result, []);
    checkPlayerResponse(result, [player1Response, player2Response]);
  });

  it('show room with 2 players and cards shuffled',async () => {
    // given
    const cards = Deck.getScrambled();
    const spiedDeck = jest.spyOn(Deck, 'getScrambled');
    spiedDeck.mockReturnValueOnce([...cards]);

    const room = new Room();
    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');
    
    room.scramble(room.players[0], 3);

    const player1Response = new RoomPlayerResponse(room.players[0], room);
    const player2Response = new RoomPlayerResponse(room.players[1], room);

    player1Response.admin = false;
    player1Response.dealer = true;
    player1Response.jogadorAtual = false;
    player1Response.nome = 'PlayerOne';
    player1Response.pontosRodada = 0;
    player1Response.pontosTotal = 0;
    player1Response.previsaoRodada = 0;
    player1Response.quantidadeCartas = 3;

    player2Response.admin = false;
    player2Response.dealer = false;
    player2Response.jogadorAtual = true;
    player2Response.nome = 'PlayerTwo';
    player2Response.pontosRodada = 0;
    player2Response.pontosTotal = 0;
    player2Response.previsaoRodada = 0;
    player2Response.quantidadeCartas = 3;

    repository.currentRoom = room;

    // when
    const result = await request(app).get('/salas').send();

    // then
    expect(result.status).toBe(200);
    expect(result.body.salaFechada).toBeTruthy();
    expect(result.body.curingas).toHaveLength(1);
    expect(result.body.curingas).toEqual([cards[0]]);
    checkDeskResponse(result, []);
    checkPlayerResponse(result, [player1Response, player2Response]);
  });

  it('show room with 2 players and forecasted',async () => {
    // given
    const cards = Deck.getScrambled();
    const spiedDeck = jest.spyOn(Deck, 'getScrambled');
    spiedDeck.mockReturnValueOnce([...cards]);

    const room = new Room();
    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');
    
    room.scramble(room.players[0], 3);
    room.setForecast(room.players[1], 3);
    room.setForecast(room.players[0], 1);

    const player1Response = new RoomPlayerResponse(room.players[0], room);
    const player2Response = new RoomPlayerResponse(room.players[1], room);

    player1Response.admin = false;
    player1Response.dealer = true;
    player1Response.jogadorAtual = false;
    player1Response.nome = 'PlayerOne';
    player1Response.pontosRodada = 0;
    player1Response.pontosTotal = 0;
    player1Response.previsaoRodada = 1;
    player1Response.quantidadeCartas = 3;

    player2Response.admin = false;
    player2Response.dealer = false;
    player2Response.jogadorAtual = true;
    player2Response.nome = 'PlayerTwo';
    player2Response.pontosRodada = 0;
    player2Response.pontosTotal = 0;
    player2Response.previsaoRodada = 3;
    player2Response.quantidadeCartas = 3;

    repository.currentRoom = room;

    // when
    const result = await request(app).get('/salas').send();

    // then
    expect(result.status).toBe(200);
    expect(result.body.salaFechada).toBeTruthy();
    expect(result.body.curingas).toHaveLength(1);
    expect(result.body.curingas).toEqual([cards[0]]);
    checkDeskResponse(result, []);
    checkPlayerResponse(result, [player1Response, player2Response]);
  });

  it('show room with 2 players and 1 card played',async () => {
    // given
    const cards = Deck.getScrambled();
    const spiedDeck = jest.spyOn(Deck, 'getScrambled');
    spiedDeck.mockReturnValueOnce([...cards]);

    const room = new Room();
    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');

    const wildCard = cards[0];
    const player1 = room.players[0];
    const player2 = room.players[1];
    //const player1Cards = cards.slice(1, 3);
    const player2Cards = cards.slice(4, 7).sort();
    
    room.scramble(player1, 3);
    room.setForecast(player2, 3);
    room.setForecast(player1, 1);

    room.playCard(player2, 0);

    const player1Response = new RoomPlayerResponse(player1, room);
    const player2Response = new RoomPlayerResponse(player2, room);

    player1Response.admin = false;
    player1Response.dealer = true;
    player1Response.jogadorAtual = true;
    player1Response.nome = 'PlayerOne';
    player1Response.pontosRodada = 0;
    player1Response.pontosTotal = 0;
    player1Response.previsaoRodada = 1;
    player1Response.quantidadeCartas = 3;

    // player 2 played card
    player2Response.admin = false;
    player2Response.dealer = false;
    player2Response.jogadorAtual = false;
    player2Response.nome = 'PlayerTwo';
    player2Response.pontosRodada = 0;
    player2Response.pontosTotal = 0;
    player2Response.previsaoRodada = 3;
    player2Response.quantidadeCartas = 2;

    const desk: RoomDeskItemResponse[] = [];

    const deskItem = new RoomDeskItemResponse(new GamePlayer(new Player('x','x'), []), '');
    deskItem.carta = player2Cards[0];
    deskItem.jogador = player2.name;

    desk.push(deskItem);

    repository.currentRoom = room;

    // when
    const result = await request(app).get('/salas').send();

    // then
    expect(result.status).toBe(200);
    expect(result.body.salaFechada).toBeTruthy();
    expect(result.body.curingas).toHaveLength(1);
    expect(result.body.curingas).toEqual([wildCard]);
    checkDeskResponse(result, desk);
    checkPlayerResponse(result, [player1Response, player2Response]);
  });

  it('show room with 2 players and 2 cards played',async () => {
    // given
    const cards = Deck.getScrambled();
    const spiedDeck = jest.spyOn(Deck, 'getScrambled');
    spiedDeck.mockReturnValueOnce([...cards]);

    const room = new Room();
    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');

    const wildCard = cards[0];
    const player1 = room.players[0];
    const player2 = room.players[1];
    const player1Cards = cards.slice(1, 4).sort();
    const player2Cards = cards.slice(4, 7).sort();
    
    room.scramble(player1, 3);
    room.setForecast(player2, 3);
    room.setForecast(player1, 1);

    room.playCard(player2, 0);
    room.playCard(player1, 1);

    const player1Response = new RoomPlayerResponse(player1, room);
    const player2Response = new RoomPlayerResponse(player2, room);

    // player 1 played card
    player1Response.admin = false;
    player1Response.dealer = true;
    player1Response.jogadorAtual = false;
    player1Response.nome = 'PlayerOne';
    player1Response.pontosRodada = 0;
    player1Response.pontosTotal = 0;
    player1Response.previsaoRodada = 1;
    player1Response.quantidadeCartas = 2;

    // player 2 played card, token returned to player 2
    player2Response.admin = false;
    player2Response.dealer = false;
    player2Response.jogadorAtual = true;
    player2Response.nome = 'PlayerTwo';
    player2Response.pontosRodada = 0;
    player2Response.pontosTotal = 0;
    player2Response.previsaoRodada = 3;
    player2Response.quantidadeCartas = 2;

    const desk: RoomDeskItemResponse[] = [];

    const deskItem1 = new RoomDeskItemResponse(new GamePlayer(new Player('x','x'), []), '');
    deskItem1.carta = player2Cards[0];
    deskItem1.jogador = player2.name;
    desk.push(deskItem1);

    const deskItem2 = new RoomDeskItemResponse(new GamePlayer(new Player('x','x'), []), '');
    deskItem2.carta = player1Cards[1];
    deskItem2.jogador = player1.name;
    desk.push(deskItem2);

    repository.currentRoom = room;

    // when
    const result = await request(app).get('/salas').send();

    // then
    expect(result.status).toBe(200);
    expect(result.body.salaFechada).toBeTruthy();
    expect(result.body.curingas).toHaveLength(1);
    expect(result.body.curingas).toEqual([wildCard]);
    checkDeskResponse(result, desk);
    checkPlayerResponse(result, [player1Response, player2Response]);
  });

  function checkDeskResponse(result: request.Response, desk: RoomDeskItemResponse[]) {      
    expect(result.body.quantidadeMesa).toBe(desk.length); 
    expect(result.body.mesa).toHaveLength(desk.length);    
    for(let i = 0; i < desk.length; ++i) {
      expect(result.body.mesa[i]).toEqual(desk[i]);
    }
  }

  function checkPlayerResponse(result: request.Response, players: RoomPlayerResponse[]) {    
    expect(result.body.jogadores).toHaveLength(players.length);
    for(let i = 0; i < players.length; ++i) {        
      expect(result.body.jogadores[i]).toEqual(players[i]);
    }
  }
});


describe('scramble', () => {

  it('should not scramble in an empty room',async () => {
    const room = new Room();

    repository.currentRoom = room;
  
    const result = await request(app).post('/salas/embaralhar').send();
  
    expect(result.status).toBe(200);
    expect(result.body.embaralhado).toBeFalsy();

    expect(room.closed).toBeFalsy();
    expect(room.currentPlayer).toBeUndefined();
    expect(room.currentGame).toBeUndefined();    
  });

  it('should not scramble negative amount of cards',async () => {
    const room = new Room();

    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');

    repository.currentRoom = room;
  
    const reqBody: RoundRequest = { 
      quantidade: -1,
      nome: 'PlayerOne',
      senha: '123'
    };
    const result = await request(app).post('/salas/embaralhar').send(reqBody);
  
    expect(result.status).toBe(200);
    expect(result.body.embaralhado).toBeFalsy();

    expect(room.closed).toBeFalsy();
    expect(room.currentPlayer).toBeUndefined();
    expect(room.currentGame).toBeUndefined();    
  });

  it('should not scramble zero cards',async () => {
    const room = new Room();

    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');

    repository.currentRoom = room;
  
    const reqBody: RoundRequest = { 
      quantidade: 0,
      nome: 'PlayerOne',
      senha: '123'
    };
    const result = await request(app).post('/salas/embaralhar').send(reqBody);
  
    expect(result.status).toBe(200);
    expect(result.body.embaralhado).toBeFalsy();

    expect(room.closed).toBeFalsy();
    expect(room.currentPlayer).toBeUndefined();
    expect(room.currentGame).toBeUndefined();    
  });

  it('should not scramble player not found',async () => {
    const room = new Room();

    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');

    repository.currentRoom = room;
  
    const reqBody: RoundRequest = { 
      quantidade: 3,
      nome: 'PlayerOne',
      senha: '1234'
    };
    const result = await request(app).post('/salas/embaralhar').send(reqBody);
  
    expect(result.status).toBe(200);
    expect(result.body.embaralhado).toBeFalsy();

    expect(room.closed).toBeFalsy();
    expect(room.currentPlayer).toBeUndefined();
    expect(room.currentGame).toBeUndefined();    
  });

  it('should not scramble room closed',async () => {
    const room = new Room();

    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');

    room.closed = true;
    repository.currentRoom = room;
  
    const reqBody: RoundRequest = { 
      quantidade: 3,
      nome: 'PlayerOne',
      senha: '1234'
    };
    const result = await request(app).post('/salas/embaralhar').send(reqBody);
  
    expect(result.status).toBe(200);
    expect(result.body.embaralhado).toBeFalsy();

    expect(room.closed).toBeTruthy();
    expect(room.currentPlayer).toBeUndefined();
    expect(room.currentGame).toBeUndefined();    
  });

  it('should not scramble room scrambled',async () => {
    const room = new Room();

    const player1 = room.join('PlayerOne', '123');
    const player2 = room.join('PlayerTwo', '123');

    room.scramble(room.players[0], 3);
    repository.currentRoom = room;
  
    const reqBody: RoundRequest = { 
      quantidade: 3,
      nome: 'PlayerOne',
      senha: '1234'
    };
    const result = await request(app).post('/salas/embaralhar').send(reqBody);
  
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

  it('should scramble positive amount of cards',async () => {
    const room = new Room();

    const player1 = room.join('PlayerOne', '123');
    const player2 = room.join('PlayerTwo', '123');

    repository.currentRoom = room;
  
    const reqBody: RoundRequest = { 
      quantidade: 3,
      nome: 'PlayerOne',
      senha: '123'
    };
    const result = await request(app).post('/salas/embaralhar').send(reqBody);
  
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