import { Desk } from '../../domain/Desk';
import { GamePlayer } from '../../domain/GamePlayer';
import { Player } from '../../domain/Player';
import { Room } from '../../domain/Room';
import { MyRoomInfoResponse } from './MyRoomInfoResponse';
import { RoomDeskItemResponse } from './RoomDesktemResponse';
import { RoomPlayerResponse } from './RoomPlayerResponse';

export class RoomResponse {
  salaFechada: boolean;
  curingas: string[];
  mesa: RoomDeskItemResponse[];
  quantidadeMesa: number;
  jogadores: RoomPlayerResponse[];
  me?: MyRoomInfoResponse;

  constructor(room: Room, me?: GamePlayer | Player) {
    this.salaFechada = room.closed;
    this.curingas = room.currentGame?.wildCard ? [room.currentGame.wildCard.toString() ?? ''] : [];

    const desk = room.currentGame ? room.currentGame.currentRound : new Desk();

    this.mesa = desk
      .getCurrentCards()
      .map((item) => new RoomDeskItemResponse(item.player, item.card));
    this.quantidadeMesa = desk.length();

    this.jogadores = room.players.map((p) => new RoomPlayerResponse(p, room)) ?? [];

    if (me) {
      if (me instanceof GamePlayer)
        this.me = MyRoomInfoResponse.fromGamePlayer(me, room);
      else
        this.me = MyRoomInfoResponse.fromPlayer(me, room);
    }
  }
}