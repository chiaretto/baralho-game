import { Request, Response } from 'express';
import { repository } from '../database/Repository';
import { MyRoomInfoResponse } from './response/MyRoomInfoResponse';
import { NewPlayerResponse } from './response/NewPlayerResponse';

interface JoinRequest {
  nome: string;
}

interface PlayerRequest {
  nome: string;
  senha: string;
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
    const body: PlayerRequest = req.body;

    const room = repository.currentRoom;
    const player = room.findRoomPlayer(body.nome, body.senha);

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
    const body: PlayerRequest = req.body;

    const room = repository.currentRoom;
    const player = room.findRoomPlayer(body.nome, body.senha);

    if (player) {
      room.changeAdmin(player, true);
    }

    res.json({
      player: player?.name,
      isAdmin: player?.admin,
    });
  }

  public turnOffAdmin(req: Request, res: Response) {
    const body: PlayerRequest = req.body;

    const room = repository.currentRoom;
    const player = room.findRoomPlayer(body.nome, body.senha);

    if (player) {
      room.changeAdmin(player, false);
    }

    res.json({
      player: player?.name,
      isAdmin: player?.admin,
    });
  }

  public viewOwnCards(req: Request, res: Response) {
    const body: PlayerRequest = req.body;

    const room = repository.currentRoom;
    const player = room.findRoomPlayer(body.nome, body.senha);

    if (player) {
      res.json(new MyRoomInfoResponse(player, room.currentPlayer));
    } else {
      res.json();
    }
  }

}

const roomPlayerController = new RoomPlayerController();

export { roomPlayerController };
