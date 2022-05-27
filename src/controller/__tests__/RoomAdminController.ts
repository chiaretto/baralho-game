import { repository } from '../../database/Repository';
import { Room } from '../../domain/Room';
import request from 'supertest';

import { app } from '../../app';
import { checkForbiddenError } from './__utils__/TestHelper';
import { BusinessErrorResponse } from '../response/BusinessErrorResponse';
import { AuthenticatedRequest } from '../request/AuthenticatedRequest';

export interface RemovePlayerRequest extends AuthenticatedRequest {
  posicaoJogadorRemovido: number;
}

describe('removePlayerByPosition', () => {
  const path = '/salas/removerJogador';

  const sendRequest = async (req: RemovePlayerRequest) => {
    return await request(app).post(path).send(req);
  };

  it('should remove second player', async () => {
    const room = new Room();
    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');
    room.currentAdmin = room.players[0];
    repository.currentRoom = room;

    const result = await sendRequest({
      nome: 'PlayerOne',
      senha: '123',
      posicaoJogadorRemovido: 1,
    });

    expect(result.status).toBe(200);
    expect(result.body.removido).toEqual('PlayerTwo');
    expect(room.players).toHaveLength(1);
  });

  it('should not remove player if not admin', async () => {
    const room = new Room();
    room.join('PlayerOne', '123');
    room.join('PlayerTwo', '123');
    repository.currentRoom = room;

    const result = await sendRequest({
      nome: 'PlayerOne',
      senha: '123',
      posicaoJogadorRemovido: 1,
    });

    const errorParams = new Map<string, string>([['playerName', 'PlayerOne']]);
    checkForbiddenError(
      result,
      new BusinessErrorResponse(
        'PlayerIsNotAdminError',
        'Player [PlayerOne] is not the admin!',
        errorParams
      )
    );
    expect(room.players).toHaveLength(2);
  });
});
