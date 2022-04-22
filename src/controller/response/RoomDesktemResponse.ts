import { GamePlayer } from '../../domain/GamePlayer';

export class RoomDeskItemResponse {
  carta: string;
  jogador: string;

  constructor(player: GamePlayer, card: string) {
    this.carta = card;
    this.jogador = player.player.name;
  }
}
