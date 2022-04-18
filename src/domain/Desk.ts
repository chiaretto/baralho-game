export class Desk {
  private cards: DeskItem[];

  constructor() {
    this.cards = [];
  }

  length() {
    return this.cards.length;
  }

  getCardByPosition(position: number) {
    return this.cards.slice(position, position + 1);
  }

  jogarCarta(card: string, playerName: string) {
    this.cards.push(new DeskItem(card, playerName));
  }

  getCurrentCards() {
    return this.cards;
  }
}

class DeskItem {
  card: string;
  playerName: string;

  constructor(card: string, playerName: string) {
    this.card = card;
    this.playerName = playerName;
  }
}
