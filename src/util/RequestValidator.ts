import { AuthenticatedRequest } from '../controller/request/AuthenticatedRequest';
import { Player } from '../domain/Player';
import { Room } from '../domain/Room';
import { PlayerNotFoundError } from '../errors/PlayerNotFoundError';
import { RoomIsEmptyError } from '../errors/RoomIsEmptyError';

export class RequestValidator {

  static validatePlayer(room: Room, authReq: AuthenticatedRequest) : Player {
    if (room.players.length == 0) {
      throw new RoomIsEmptyError();
    }
    const player = room.findRoomPlayer(authReq.nome, authReq.senha);
    if (player === undefined) {
      throw new PlayerNotFoundError(authReq.nome);
    }
    return player;
  }
}