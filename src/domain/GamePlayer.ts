import { Player } from './Player';

export class GamePlayer {
  player: Player;
  cards: string[];
  score: number;
  forecast: number;

  constructor(player: Player, cards: string[]) {
    this.player = player;
    this.cards = cards;
    this.score = 0;
    this.forecast = 0;
  }

  removeCardFromPosition(cardPosition: number): string {
    return this.cards.splice(cardPosition, 1)[0];
  }

}