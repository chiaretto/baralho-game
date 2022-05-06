import { Card, Deck } from '../Deck';

describe('deck', () => {
  it('should have all deck cards', async() => {
    const scrambled = Deck.getScrambled();
    expect(scrambled).toHaveLength(104);
  });
});

describe('card', () => {
  it('should parse valid card', async() => {
    //given
    const card1 = 'A♦r';
    const card2 = '2♣b';
    const card3 = '9♠r';
    const card4 = '10♥b';

    //when
    const c1 = Card.parse(card1);
    const c2 = Card.parse(card2);
    const c3 = Card.parse(card3);
    const c4 = Card.parse(card4);

    //then
    expect(c1.value).toEqual('A');
    expect(c1.suit).toEqual('♦');
    expect(c1.color).toEqual('r');

    expect(c2.value).toEqual('2');
    expect(c2.suit).toEqual('♣');
    expect(c2.color).toEqual('b');

    expect(c3.value).toEqual('9');
    expect(c3.suit).toEqual('♠');
    expect(c3.color).toEqual('r');

    expect(c4.value).toEqual('10');
    expect(c4.suit).toEqual('♥');
    expect(c4.color).toEqual('b');
  });

  it('should not parse invalid card', async() => {
    //given
    const card1 = 'A♦';
    const card2 = '1♣b';
    const card3 = '9xr';
    const card4 = '10♥z';

    //when
    const c1 = () => { Card.parse(card1); };
    const c2 = () => { Card.parse(card2); };
    const c3 = () => { Card.parse(card3); };
    const c4 = () => { Card.parse(card4); };      

    //then
    expect(c1).toThrow(Error);
    expect(c1).toThrow('Invalid card ' + card1);

    expect(c2).toThrow(Error);
    expect(c2).toThrow('Invalid card ' + card2);

    expect(c3).toThrow(Error);
    expect(c3).toThrow('Invalid card ' + card3);

    expect(c4).toThrow(Error);
    expect(c4).toThrow('Invalid card ' + card4);
  });
});