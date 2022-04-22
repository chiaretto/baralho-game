import { Desk } from '../../domain/Desk';
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
    this.curingas = room.getWildCard() ? [room.getWildCard() ?? ''] : [];

    const desk = room.currentGame ? room.currentGame.getCurrentRound() : new Desk();

    this.mesa = desk
      .getCurrentCards()
      .map((item) => new RoomDeskItemResponse(item.player, item.card));
    this.quantidadeMesa = desk.length();

    this.jogadores = room.players.map((p) => new RoomPlayerResponse(p, room)) ?? [];
  }
}
