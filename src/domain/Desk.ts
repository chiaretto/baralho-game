import { GamePlayer } from './GamePlayer';

export class Desk {
  private cards: DeskItem[];

  constructor() {
    this.cards = [];
  }

  length() {
    return this.cards.length;
  }

  getDeskItemByPosition(position: number) : DeskItem {
    return this.cards.slice(position, position + 1)[0];
  }

  playCard(player: GamePlayer, card: string) {
    this.cards.push(new DeskItem(card, player));
  }

  getCurrentCards(): DeskItem[] {
    return this.cards;
  }

  getPlayedCard(player: GamePlayer) : DeskItem | undefined {
    return this.cards.find((di) => di.player === player);
  }
}

export class DeskItem {
  card: string;
  player: GamePlayer;

  constructor(card: string, player: GamePlayer) {
    this.card = card;
    this.player = player;
  }
}
