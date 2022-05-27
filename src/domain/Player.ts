export class Player {
  id: string;
  name: string;
  fullScore: number;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.fullScore = 0;
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

  static nextPlayerPosition(players: Player[], position: number) {
    let nextPlayerPosition = position + 1;
    if (nextPlayerPosition >= players.length) {
      nextPlayerPosition = nextPlayerPosition % players.length;
    }
    return nextPlayerPosition;
  }
}
