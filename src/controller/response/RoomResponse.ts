import { Room } from '../../domain/Room';
import { RoomDeskItemResponse } from './RoomDesktemResponse';
import { RoomPlayerResponse } from './RoomPlayerResponse';

export class RoomResponse {
  salaFechada: boolean;
  curingas: string[];
  mesa: RoomDeskItemResponse[];
  quantidadeMesa: number;
  jogadores: RoomPlayerResponse[];

  constructor(room: Room) {
    this.salaFechada = room.closed;
    this.curingas = room.wildcard ? [room.wildcard] : [];

    this.mesa = room.desk
      .getCurrentCards()
      .map((item) => new RoomDeskItemResponse(item.player, item.card));
    this.quantidadeMesa = room.desk.length();

    this.jogadores = room.players.map((p) => new RoomPlayerResponse(p, room.currentPlayer));
  }
}
