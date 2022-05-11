import { Request, Response } from 'express';
import { Deck } from '../domain/Deck';
import { repository } from '../database/Repository';
import { RoomResponse } from './response/RoomResponse';
import { RoomScoreDetailedResponse } from './response/score/RoomScoreDetailedResponse';
import { RequestValidator } from '../util/RequestValidator';
import { AuthenticatedRequest } from './request/AuthenticatedRequest';

export interface RoundRequest extends AuthenticatedRequest {
  quantidade: number;
}

class RoomController {

  public home(req: Request, res: Response) {
    return res.json(Deck.allCards);
  }

  public showRoom(req: Request, res: Response) {
    return res.json(new RoomResponse(repository.currentRoom));
  }

  public scramble(req: Request, res: Response) {
    const body: RoundRequest = req.body;
    const room = repository.currentRoom;

    const player = RequestValidator.validatePlayer(room, body);
    
    let scrambled = false;
    if (!room.closed && body.quantidade > 0) {
      scrambled = room.scramble(body.quantidade, player);
    }

    res.json({
      embaralhado: scrambled,
    });
  }

  public setCurrentWinner(req: Request, res: Response) {
    const body: AuthenticatedRequest = req.body;
    
    const room = repository.currentRoom;
    RequestValidator.validatePlayer(room, body);
    
    const winner = room.setFinishDesk();
    res.json({
      nome: winner.name,
    });
  }

  public fullScore(req: Request, res: Response) {
    res.json(new RoomScoreDetailedResponse(repository.currentRoom));
  }

  public newRound(req: Request, res: Response) {
    const room = repository.currentRoom;
    //room.newRound();
    res.json(new RoomResponse(room));
  }

  public reboot(req: Request, res: Response) {
    const room = repository.currentRoom;
    room.reboot();
    res.json();
  }

}

export const roomController = new RoomController();
