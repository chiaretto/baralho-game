import { Request, Response } from 'express';
import { repository } from '../database/Repository';
import { PlayerIsNotAdminError } from '../errors/PlayerIsNotAdminError';
import { RequestValidator } from '../util/RequestValidator';
import { AuthenticatedRequest } from './request/AuthenticatedRequest';
import { MyRoomInfoResponse } from './response/MyRoomInfoResponse';
import { NewPlayerResponse } from './response/NewPlayerResponse';

export interface JoinRequest {
  nome: string;
}

export interface RemovePlayerRequest extends AuthenticatedRequest {
  posicaoJogadorRemovido: number;
}

class RoomPlayerController {

  public join(req: Request, res: Response) {
    const body: JoinRequest = req.body;
    const pwd = (Math.random() + Math.random()).toString();

    const room = repository.currentRoom;

    if (!room.closed) {      
      const newPlayer = room.join(body.nome, pwd);
      res.json(new NewPlayerResponse(newPlayer, pwd));
    }
  }

  public leave(req: Request, res: Response) {
    const body: AuthenticatedRequest = req.body;

    const room = repository.currentRoom;
    const player = RequestValidator.validatePlayer(room, body);
    room.leave(player);

    res.json({
      nome: player.name,
    });
  }

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

  public viewOwnCards(req: Request, res: Response) {
    const body: AuthenticatedRequest = req.body;

    const room = repository.currentRoom;
    const player = RequestValidator.validatePlayer(room, body);
    res.json(MyRoomInfoResponse.fromPlayer(player, room));
  }

}

const roomPlayerController = new RoomPlayerController();

export { roomPlayerController };
