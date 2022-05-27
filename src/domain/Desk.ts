import { Card } from './Deck';
import { GamePlayer } from './GamePlayer';

export class Desk {
  private _items: DeskItem[];

  constructor() {
    this._items = [];
  }

  length() {
    return this._items.length;
  }

  playCard(player: GamePlayer, card: Card) {
    this._items.push(new DeskItem(card, player, this._items.length));
  }

  getCurrentCards(): DeskItem[] {
    return [...this._items];
  }

  getPlayedCard(player: GamePlayer): DeskItem | undefined {
    return this._items.find((di) => di.player === player);
  }
}

export class DeskItem {
  readonly card: Card;
  readonly player: GamePlayer;
  readonly position: number;

  constructor(card: Card, player: GamePlayer, position: number) {
    this.card = card;
    this.player = player;
    this.position = position;
  }
}
