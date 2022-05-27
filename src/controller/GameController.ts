import { Request, Response } from 'express';
import { repository } from '../database/Repository';
import { InvalidRequestError } from '../errors/InvalidRequestError';
import { RequestValidator } from '../util/RequestValidator';
import { AuthenticatedRequest } from './request/AuthenticatedRequest';
import {
  ForecastRequest,
  PlayRequest,
  RoundRequest,
} from './request/GameControllerRequests';
import { MyRoomInfoResponse } from './response/MyRoomInfoResponse';

class GameController {
  public play(req: Request, res: Response) {
    const body: PlayRequest = req.body;
    const room = repository.currentRoom;

    if (body.posicaoCarta < 0) {
      throw new InvalidRequestError(
        'Invalid card position ' + body.posicaoCarta
      );
    }

    const player = RequestValidator.validatePlayer(room, body);

    let cards: string[] = [];
    if (player) {
      cards = room
        .playCard(player, body.posicaoCarta)
        .cards.map((c) => c.toString());
    }

    res.json({
      cartas: cards,
    });
  }

  public setForecast(req: Request, res: Response) {
    const body: ForecastRequest = req.body;
    const room = repository.currentRoom;

    if (body.quantidade < 0) {
      throw new InvalidRequestError(
        'Invalid quantity value ' + body.quantidade
      );
    }

    const player = RequestValidator.validatePlayer(room, body);

    const gamePlayer = room.setForecast(player, body.quantidade);
    res.json(MyRoomInfoResponse.fromGamePlayer(gamePlayer, room));
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

  public finishRound(req: Request, res: Response) {
    const body: AuthenticatedRequest = req.body;

    const room = repository.currentRoom;
    RequestValidator.validatePlayer(room, body);

    const winner = room.setFinishDesk();
    res.json({
      nome: winner.name,
    });
  }
}

const gameController = new GameController();

export { gameController };
