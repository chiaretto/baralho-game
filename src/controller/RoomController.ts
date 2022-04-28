import { Request, Response } from 'express';
import { Deck } from '../domain/Deck';
import { repository } from '../database/Repository';
import { RoomResponse } from './response/RoomResponse';
import { MyRoomInfoResponse } from './response/MyRoomInfoResponse';
import { RoomScoreDetailedResponse } from './response/score/RoomScoreDetailedResponse';

export interface RoundRequest {
  quantidade: number;
  nome: string;
  senha: string;
}

export interface PlayRequest {
  nome: string;
  senha: string;
  posicaoCarta: number;
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

    const dealer = room.findRoomPlayer(body.nome, body.senha);

    let scrambled = false;
    if (dealer && !room.closed && body.quantidade > 0) {
      room.scramble(dealer, body.quantidade);

      scrambled = true;
    }

    res.json({
      embaralhado: scrambled,
    });
  }

  public setCurrentWinner(req: Request, res: Response) {
    const winnerPosition = req.body.posicaoCartaVencedora;

    const room = repository.currentRoom;
    const winner = room.setCurrentWinnerByDeskPosition(winnerPosition);
    if (winner) {
      res.json({
        nome: winner.name,
      });
    } else {
      res.json({
        error: 'Winner not found',
      });
    }
  }

  public play(req: Request, res: Response) {
    const body: PlayRequest = req.body;
    const room = repository.currentRoom;

    const player = room.findRoomPlayer(body.nome, body.senha);

    let cards: string[] = [];
    if (player && body.posicaoCarta >= 0) {
      cards = room.playCard(player, body.posicaoCarta);
    }

    res.json({
      cartas: cards,
    });
  }

  public setForecast(req: Request, res: Response) {
    const body: RoundRequest = req.body;
    const room = repository.currentRoom;

    const player = room.findRoomPlayer(body.nome, body.senha);

    if (player) {
      room.setForecast(player, body.quantidade);
      res.json(new MyRoomInfoResponse(player, room));
    } else {
      res.json();
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
