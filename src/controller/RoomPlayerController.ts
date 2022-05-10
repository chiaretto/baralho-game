import { Request, Response } from 'express';
import { repository } from '../database/Repository';
import { RequestValidator } from '../util/RequestValidator';
import { AuthenticatedRequest } from './request/AuthenticatedRequest';
import { MyRoomInfoResponse } from './response/MyRoomInfoResponse';
import { NewPlayerResponse } from './response/NewPlayerResponse';

interface JoinRequest {
  nome: string;
}
class RoomPlayerController {

  public join(req: Request, res: Response) {
    const body: JoinRequest = req.body;
    const pwd = (Math.random() + Math.random()).toString();

    const room = repository.currentRoom;

    if (!room.closed) {      
      const newPlayer = room.join(body.nome, pwd);
      if (newPlayer)
        res.json(new NewPlayerResponse(newPlayer, pwd));
    }
  }

  public leave(req: Request, res: Response) {
    const body: AuthenticatedRequest = req.body;

    const room = repository.currentRoom;
    const player = RequestValidator.validatePlayer(room, body);

    if (player) {
      room.leave(player);
    }

    res.json({
      left: player?.name,
    });
  }

  public removePlayerByPosition(req: Request, res: Response) {
    const playerPosition = parseInt(req.body.posicaoJogadorRemovido);

    const room = repository.currentRoom;

    const player = room.removePlayerByPosition(playerPosition);

    res.json({
      removido: player?.name,
    });
  }

  public turnOnAdmin(req: Request, res: Response) {
    const body: AuthenticatedRequest = req.body;

    const room = repository.currentRoom;
    const player = RequestValidator.validatePlayer(room, body);

    if (player) {
      room.changeAdmin(player, true);
    }

    res.json({
      player: player?.name,
      isAdmin: player === room.currentAdmin,
    });
  }

  public turnOffAdmin(req: Request, res: Response) {
    const body: AuthenticatedRequest = req.body;

    const room = repository.currentRoom;
    const player = RequestValidator.validatePlayer(room, body);

    if (player) {
      room.changeAdmin(player, false);
    }

    res.json({
      player: player?.name,
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
