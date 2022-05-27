import { Card } from './Deck';
import { Player } from './Player';

export class GamePlayer {
  player: Player;
  cards: Card[];
  score: number;
  forecast?: number;

  constructor(player: Player, cards: Card[]) {
    this.player = player;
    this.cards = cards;
    this.score = 0;
    this.forecast = undefined;
  }

  removeCardFromPosition(cardPosition: number): Card {
    return this.cards.splice(cardPosition, 1)[0];
  }

  computedScore(): number {
    if (this.forecast === this.score) {
      return 3 + this.score;
    }
    return 0;
  }
}
