export class Deck {
  static readonly colours: string[] = ['r', 'b'];

  static readonly nypes = ['♥', '♦', '♣', '♠'];

  static readonly cards = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
  ];

  static readonly fullCardsColours = Deck.nypes
    .map((nype) => {
      return Deck.cards.map((card) => card + nype);
    })
    .reduce((a, b) => a.concat(b), []);

  static readonly fullCards = Deck.colours
    .map((colour) => {
      return Deck.fullCardsColours.map((card) => card + colour);
    })
    .reduce((a, b) => a.concat(b), []);

  public static getScrambled(): string[] {
    const newDeck = [...Deck.fullCards];
    return newDeck.sort(() => 0.5 - Math.random());
  }
}
