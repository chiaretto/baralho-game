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
    this.curingas = room.curinga ? [room.curinga] : [];

    this.mesa = room.desk
      .getCurrentCards()
      .map((item) => new RoomDeskItemResponse(item.card, item.playerName));
    this.quantidadeMesa = room.desk.length();

    this.jogadores = room.jogadores.map((p) => new RoomPlayerResponse(p));
  }
}
