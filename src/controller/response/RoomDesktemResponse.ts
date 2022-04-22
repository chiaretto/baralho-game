import { Player } from "../../domain/Player";

export class RoomDeskItemResponse {
  carta: string;
  jogador: string;

  constructor(player: Player, card: string) {
    this.carta = card;
    this.jogador = player.name;
  }
}
