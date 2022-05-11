import { repository } from '../../database/Repository';
import { Room } from '../../domain/Room';
import request from 'supertest';

import { app } from '../../app';
import { JoinRequest, RemovePlayerRequest } from '../RoomPlayerController';
import { checkBusinessError, checkForbiddenError } from './__utils__/TestHelper';
import { BusinessErrorResponse } from '../response/BusinessErrorResponse';
import { AuthenticatedRequest } from '../request/AuthenticatedRequest';

describe('join', () => {

  const path = '/salas/entrar';

  const sendRequest = async (req: JoinRequest) => {
    return await request(app).post(path).send(req);
  };

  it('should join new player first',async () => {
    const room = new Room();
    repository.currentRoom = room;
  
    const result = await sendRequest({
      nome: 'PlayerOne'
    });
  
    expect(result.status).toBe(200);
    expect(result.body.nome).toEqual('PlayerOne');
    expect(result.body.senha).not.toBeUndefined();
    expect(room.players).toHaveLength(1);
  });

  it('should join new player second',async () => {
    const room = new Room();
    room.join('PlayerOne', '123');

    repository.currentRoom = room;
  
    const result = await sendRequest({
      nome: 'PlayerTwo'
    });
  
    expect(result.status).toBe(200);
    expect(result.body.nome).toEqual('PlayerTwo');
    expect(result.body.senha).not.toBeUndefined();

    expect(room.players).toHaveLength(2);
  });

  it('should not join already joined player',async () => {
    const room = new Room();
    room.join('PlayerOne', '123');

    repository.currentRoom = room;
  
    const result = await sendRequest({
      nome: 'PlayerOne'
    });
  
    const errorParams = new Map<string, string>([
      ['playerName', 'PlayerOne']
    ]);
    checkBusinessError(result, new BusinessErrorResponse('PlayerAlreadyExistsError', 'Player with name [PlayerOne] has already joined the room!', errorParams));
    expect(room.players).toHaveLength(1);
  });
});

describe('leave', () => {

  const path = '/salas/sair';
  
  const sendRequest = async (req: AuthenticatedRequest) => {
    return await request(app).post(path).send(req);
  };
  
  it('should leave player',async () => {
    const room = new Room();
    room.join('PlayerOne', '123');
    repository.currentRoom = room;
    
    const result = await sendRequest({
      nome: 'PlayerOne',
      senha: '123'
    });
    
    expect(result.status).toBe(200);
    expect(result.body.nome).toEqual('PlayerOne');
    expect(room.players).toHaveLength(0);
  });
  
  it('should leave player',async () => {
    const room = new Room();
    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');
    repository.currentRoom = room;
    
    const result = await sendRequest({
      nome: 'PlayerOne',
      senha: '123'
    });
    
    expect(result.status).toBe(200);
    expect(result.body.nome).toEqual('PlayerOne');
    expect(room.players).toHaveLength(1);
  });
});


describe('removePlayerByPosition', () => {

  const path = '/salas/removerJogador';
    
  const sendRequest = async (req: RemovePlayerRequest) => {
    return await request(app).post(path).send(req);
  };
    
  it('should remove second player',async () => {
    const room = new Room();
    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');
    room.currentAdmin = room.players[0];
    repository.currentRoom = room;
      
    const result = await sendRequest({
      nome: 'PlayerOne',
      senha: '123',
      posicaoJogadorRemovido: 1
    });
      
    expect(result.status).toBe(200);
    expect(result.body.removido).toEqual('PlayerTwo');
    expect(room.players).toHaveLength(1);
  });

  it('should not remove player if not admin',async () => {
    const room = new Room();
    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');
    repository.currentRoom = room;
      
    const result = await sendRequest({
      nome: 'PlayerOne',
      senha: '123',
      posicaoJogadorRemovido: 1
    });
      
    const errorParams = new Map<string, string>([
      ['playerName', 'PlayerOne']
    ]);
    checkForbiddenError(result, new BusinessErrorResponse('PlayerIsNotAdminError', 'Player [PlayerOne] is not the admin!', errorParams));
    expect(room.players).toHaveLength(2);
  });
});