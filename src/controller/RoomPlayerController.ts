import { Request, Response } from 'express';
import { repository } from '../database/Repository';
import { PlayerNotFoundError } from '../errors/PlayerNotFoundError';
import { RoomIsEmptyError } from '../errors/RoomIsEmptyError';
import { RequestValidator } from '../util/RequestValidator';
import { AuthenticatedRequest } from './request/AuthenticatedRequest';
import { MyRoomInfoResponse } from './response/MyRoomInfoResponse';
import { NewPlayerResponse } from './response/NewPlayerResponse';

export interface JoinRequest {
  nome: string;
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
    try {
      const player = RequestValidator.validatePlayer(room, body);
      room.leave(player);
      res.json({
        nome: player.name,
      });
    } catch (e) {
      if (e instanceof PlayerNotFoundError || e instanceof RoomIsEmptyError) {
        res.json({
          nome: body.nome,
        });
      } else throw e;
    }
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
