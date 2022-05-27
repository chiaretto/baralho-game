import { Request, Response } from 'express';
import { repository } from '../database/Repository';
import { PlayerIsNotAdminError } from '../errors/PlayerIsNotAdminError';
import { RequestValidator } from '../util/RequestValidator';
import { AuthenticatedRequest } from './request/AuthenticatedRequest';

export interface RemovePlayerRequest extends AuthenticatedRequest {
  posicaoJogadorRemovido: number;
}

class RoomAdminController {
  public removePlayerByPosition(req: Request, res: Response) {
    const body: RemovePlayerRequest = req.body;

    const room = repository.currentRoom;
    const playerAdmin = RequestValidator.validatePlayer(room, body);

    if (room.currentAdmin != playerAdmin) {
      throw new PlayerIsNotAdminError(body.nome);
    }

    const player = room.removePlayerByPosition(body.posicaoJogadorRemovido);

    res.json({
      removido: player?.name,
    });
  }

  public turnOnAdmin(req: Request, res: Response) {
    const body: AuthenticatedRequest = req.body;

    const room = repository.currentRoom;
    const player = RequestValidator.validatePlayer(room, body);

    room.changeAdmin(player, true);

    res.json({
      player: player.name,
      isAdmin: player === room.currentAdmin,
    });
  }

  public turnOffAdmin(req: Request, res: Response) {
    const body: AuthenticatedRequest = req.body;

    const room = repository.currentRoom;
    const player = RequestValidator.validatePlayer(room, body);

    room.changeAdmin(player, false);

    res.json({
      player: player.name,
      isAdmin: player === room.currentAdmin,
    });
  }
}

const roomAdminController = new RoomAdminController();

export { roomAdminController };
