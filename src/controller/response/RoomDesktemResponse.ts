import { Card } from '../../domain/Deck';
import { GamePlayer } from '../../domain/GamePlayer';

export class RoomDeskItemResponse {
  carta: string;
  jogador: string;

  constructor(player: GamePlayer, card: Card) {
    this.carta = card.toString();
    this.jogador = player.player.name;
  }
}
