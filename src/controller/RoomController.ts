import { Request, Response } from 'express';
import { Deck } from '../domain/Deck';
import { repository } from '../database/Repository';
import { RoomResponse } from './response/RoomResponse';
import { RoomScoreDetailedResponse } from './response/score/RoomScoreDetailedResponse';
import { RequestValidator } from '../util/RequestValidator';
import { Player } from '../domain/Player';
import { AuthenticatedRequest } from './request/AuthenticatedRequest';

class RoomController {
  public home(req: Request, res: Response) {
    return res.json(Deck.allCards);
  }

  public showRoom(req: Request, res: Response) {
    const room = repository.currentRoom;
    const body: AuthenticatedRequest = req.body;

    let player: Player | undefined;
    if (req.method == 'POST' && body) {
      player = RequestValidator.validatePlayer(room, body);
    }

    const roomResponse = new RoomResponse(repository.currentRoom, player);
    return res.json(roomResponse);
  }

  public fullScore(req: Request, res: Response) {
    res.json(new RoomScoreDetailedResponse(repository.currentRoom));
  }

  public reboot(req: Request, res: Response) {
    const room = repository.currentRoom;
    room.reboot();
    res.json();
  }
}

export const roomController = new RoomController();
