import { Request, Response } from 'express';
import { Deck } from '../domain/Deck';
import { repository } from '../database/Repository';
import { RoomResponse } from './response/RoomResponse';

interface ScrambleRequest {
  quantidade: number;
  nome: string;
  senha: string;
}

interface PlayRequest {
  nome: string;
  senha: string;
  posicaoCarta: number;
}

class RoomController {

  public home(req: Request, res: Response) {
    return res.json(Deck.fullCards);
  }

  public showRoom(req: Request, res: Response) {
    return res.json(new RoomResponse(repository.currentRoom));
  }

  public scramble(req: Request, res: Response) {
    const body: ScrambleRequest = req.body;
    const room = repository.currentRoom;

    const dealer = room.findRoomPlayer(body.nome, body.senha);

    let scrambled = false;
    if (dealer && body.quantidade > 0) {
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

  public newRound(req: Request, res: Response) {
    const room = repository.currentRoom;
    room.newRound();
    res.json(new RoomResponse(room));
  }

  public reboot(req: Request, res: Response) {
    const room = repository.currentRoom;
    room.reboot();
    res.json();
  }
}

export const roomController = new RoomController();
