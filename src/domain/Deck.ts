const COLORS: string[] = ['r', 'b'];

const SUITS = ['♥', '♦', '♣', '♠'];

const CARD_VALUES = [
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

export class Deck {  

  private static readonly fullCardsColours = SUITS
    .map((suit) => {
      return CARD_VALUES.map((card) => card + suit);
    })
    .reduce((a, b) => a.concat(b), []);

  private static readonly fullCards = COLORS
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

export class Card {
  readonly value: string;
  readonly suit: string;
  readonly color: string;
  readonly valuedNumber: number;

  constructor(value: string, suit: string, color: string) {
    this.value = value;
    this.suit = suit;
    this.color = color;
    this.valuedNumber = CARD_VALUES.lastIndexOf(value);
  }

  static parse(str: string) : Card {
    let suitPosition = 1;
    if (str[0] == '1') suitPosition = 2;

    if (str.length != (2+suitPosition)) throw new Error('Invalid card ' + str);

    const value = str.substring(0, suitPosition);
    if (CARD_VALUES.indexOf(value) < 0) throw new Error('Invalid card ' + str);

    const suit = str.substring(suitPosition, suitPosition+1);  
    if (SUITS.indexOf(suit) < 0) throw new Error('Invalid card ' + str);

    const color = str.substring(suitPosition+1);
    if (COLORS.indexOf(color) < 0) throw new Error('Invalid card ' + str);

    return new Card(value, suit, color);
  }

  toString() : string {
    return this.value + this.suit + this.color;
  }
}
