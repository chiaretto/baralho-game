import { Request, Response } from 'express';
import { Deck } from '../domain/Deck';
import { repository } from '../database/Repository';
import { RoomResponse } from './response/RoomResponse';
import { RoomScoreDetailedResponse } from './response/score/RoomScoreDetailedResponse';
import { InvalidRequestError } from '../errors/InvalidRequestError';
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
    if (player && !room.closed && body.quantidade > 0) {
      room.scramble(body.quantidade);

      scrambled = true;
    }

    res.json({
      embaralhado: scrambled,
    });
  }

  public setCurrentWinner(req: Request, res: Response) {
    const winnerPosition = parseInt(req.body.posicaoCartaVencedora);
    if (isNaN(winnerPosition) || winnerPosition < 0) {
      throw new InvalidRequestError('Invalid card position');
    }

    const room = repository.currentRoom;
    const winner = room.setCurrentWinnerByDeskPosition(winnerPosition);
    if (winner) {
      res.json({
        nome: winner.name,
      });
    } else {
      res.json({
        message: 'Winner not found',
      });
    }
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
