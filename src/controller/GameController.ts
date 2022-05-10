import { Request, Response } from 'express';
import { repository } from '../database/Repository';
import { InvalidRequestError } from '../errors/InvalidRequestError';
import { RequestValidator } from '../util/RequestValidator';
import { AuthenticatedRequest } from './request/AuthenticatedRequest';
import { MyRoomInfoResponse } from './response/MyRoomInfoResponse';

export interface PlayRequest extends AuthenticatedRequest {
  posicaoCarta: number;
}

export interface ForecastRequest extends AuthenticatedRequest {
  quantidade: number;
}

class GameController {

  public play(req: Request, res: Response) {
    const body: PlayRequest = req.body;
    const room = repository.currentRoom;

    if (body.posicaoCarta < 0) {
      throw new InvalidRequestError('Invalid card position ' + body.posicaoCarta);
    }

    const player = RequestValidator.validatePlayer(room, body);

    let cards: string[] = [];
    if (player) {
      cards = room.playCard(player, body.posicaoCarta).cards.map((c) => c.toString());
    }

    res.json({
      cartas: cards,
    });
  }

  public setForecast(req: Request, res: Response) {
    const body: ForecastRequest = req.body;
    const room = repository.currentRoom;

    if (body.quantidade < 0) {
      throw new InvalidRequestError('Invalid quantity value ' + body.quantidade);
    }
    
    const player = RequestValidator.validatePlayer(room, body);

    const gamePlayer = room.setForecast(player, body.quantidade);
    res.json(MyRoomInfoResponse.fromGamePlayer(gamePlayer, room));
  }

}

const gameController = new GameController();

export { gameController };
