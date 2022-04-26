export class Deck {
  private static readonly colours: string[] = ['r', 'b'];

  private static readonly nypes = ['♥', '♦', '♣', '♠'];

  private static readonly cards = [
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

  private static readonly fullCardsColours = Deck.nypes
    .map((nype) => {
      return Deck.cards.map((card) => card + nype);
    })
    .reduce((a, b) => a.concat(b), []);

  private static readonly fullCards = Deck.colours
    .map((colour) => {
      return Deck.fullCardsColours.map((card) => card + colour);
    })
    .reduce((a, b) => a.concat(b), []);

  public static getScrambled(): string[] {
    const newDeck = [...Deck.fullCards];
    return newDeck.sort(() => 0.5 - Math.random());
  }

  public static get allCards(): string[] {
    return [...Deck.fullCards];
  }
}
