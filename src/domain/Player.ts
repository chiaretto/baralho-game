export class Player {
  id: string;
  name: string;
  cards: string[];
  currentScore: number;
  currentForecast: number;
  dealer: boolean;
  admin: boolean;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.cards = [];
    this.currentScore = 0;
    this.currentForecast = 0;
    this.dealer = false;
    this.admin = false;
  }

  reset() {
    this.cards = [];
    this.currentScore = 0;
    this.currentForecast = 0;
    this.dealer = false;
  }

  removeCardFromPosition(cardPosition: number): string {
    return this.cards.splice(cardPosition, 1)[0];
  }

  static findPlayerByName(players: Player[], name: string): Player | undefined {
    const player = players.find((j) => {
      return j.name === name;
    });
    return player;
  }
  static findPlayerByNameAndId(
    players: Player[],
    name: string,
    id: string
  ): Player | undefined {
    const player = players.find((j) => {
      return j.name === name && j.id == id;
    });
    return player;
  }
}
