import { Player } from "./Player";

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

  playCard(player: Player, card: string) {
    this.cards.push(new DeskItem(card, player));
  }

  getCurrentCards(): DeskItem[] {
    return this.cards;
  }

  getPlayedCard(player: Player) : DeskItem | undefined {
    return this.cards.find((di) => di.player === player);
  }
}

class DeskItem {
  card: string;
  player: Player;

  constructor(card: string, player: Player) {
    this.card = card;
    this.player = player;
  }
}
