import { Card } from '../../domain/Deck';
import { DeskItem } from '../../domain/Desk';
import { GamePlayer } from '../../domain/GamePlayer';
import { Player } from '../../domain/Player';
import { DeskCardComparator } from '../DeskCardComparator';

describe('compareCards', () => {
  const wildCard = Card.parse('2♣r');

  it('should sort 2 different normal cards', async () => {
    const cardA = new Card('2', '♦', 'r');
    const cardB = new Card('3', '♠', 'b');

    const comparator = new DeskCardComparator(wildCard);

    // when
    const result = [cardA, cardB].sort(comparator.cardComparator);

    // then
    expect(result).toEqual([cardA, cardB]);
  });

  it('should sort 1 normal card and 1 normal wildcard ', async () => {
    const cardA = new Card('2', '♣', 'r');
    const cardB = new Card('3', '♠', 'b');

    const comparator = new DeskCardComparator(wildCard);

    // when
    const result = [cardA, cardB].sort(comparator.cardComparator);

    // then
    expect(result).toEqual([cardB, cardA]);
  });

  it('should sort 2 normal wildcard ', async () => {
    const cardA = new Card('5', '♣', 'r');
    const cardB = new Card('J', '♣', 'b');

    const comparator = new DeskCardComparator(wildCard);

    // when
    const result = [cardA, cardB].sort(comparator.cardComparator);

    // then
    expect(result).toEqual([cardA, cardB]);
  });

  it('should sort all cards', async () => {
    const cards = [
      '2♦r',
      '3♦r',
      'A♦r',
      '3♣b',
      '5♣b',
      '9♠r',
      '2♣r',
      '10♥b',
      'A♣r',
    ].map((c) => Card.parse(c));
    const wildCard = Card.parse('2♣r');

    const comparator = new DeskCardComparator(wildCard);

    // when
    const result = cards.sort(comparator.cardComparator);

    // then
    const expected = [
      '2♦r',
      '3♦r',
      '9♠r',
      '10♥b',
      'A♦r',
      '3♣b',
      '5♣b',
      'A♣r',
      '2♣r',
    ].map((c) => Card.parse(c));
    expect(result).toEqual(expected);
  });
});

describe('compareDeskItem', () => {
  const playerA = new Player('id123', 'PlayerOne');
  const playerB = new Player('id456', 'PlayerTwo');

  const wildCard = Card.parse('2♣r');

  it('should compare 2 different desk items with normal cards', async () => {
    const cardA = new Card('2', '♦', 'r');
    const cardB = new Card('3', '♠', 'b');
    const gamePlayerA = new GamePlayer(playerA, [cardA]);
    const gamePlayerB = new GamePlayer(playerB, [cardB]);

    const itemA = new DeskItem(gamePlayerA.cards[0], gamePlayerA, 0);
    const itemB = new DeskItem(gamePlayerB.cards[0], gamePlayerB, 1);

    const comparator = new DeskCardComparator(wildCard);

    // when
    const result = comparator.deskItemComparator(itemA, itemB);

    // then
    expect(result).toBe(-1);
  });

  it('should sort 2 different desk items with normal cards', async () => {
    const cardA = new Card('2', '♦', 'r');
    const cardB = new Card('3', '♠', 'b');
    const gamePlayerA = new GamePlayer(playerA, [cardA]);
    const gamePlayerB = new GamePlayer(playerB, [cardB]);

    const itemA = new DeskItem(gamePlayerA.cards[0], gamePlayerA, 0);
    const itemB = new DeskItem(gamePlayerB.cards[0], gamePlayerB, 1);

    const comparator = new DeskCardComparator(wildCard);

    // when
    const result = [itemA, itemB].sort(comparator.deskItemComparator);

    // then
    expect(result).toEqual([itemA, itemB]);
  });

  it('should sort 2 same desk items', async () => {
    const cardA = new Card('2', '♦', 'r');
    const cardB = new Card('2', '♠', 'b');
    const gamePlayerA = new GamePlayer(playerA, [cardA]);
    const gamePlayerB = new GamePlayer(playerB, [cardB]);

    const itemA = new DeskItem(gamePlayerA.cards[0], gamePlayerA, 1);
    const itemB = new DeskItem(gamePlayerB.cards[0], gamePlayerB, 0);

    const comparator = new DeskCardComparator(wildCard);

    // when
    const result1 = [itemA, itemB].sort(comparator.deskItemComparator);
    const result2 = [itemB, itemA].sort(comparator.deskItemComparator);

    // then
    expect(result1).toEqual([itemA, itemB]);
    expect(result2).toEqual([itemA, itemB]);
  });

  it('should sort list desk items', async () => {
    const cards = [
      'A♦r',
      'K♠b',
      'Q♠b',
      'J♠b',
      '10♠b',
      '9♠b',
      '8♠b',
      '7♠b',
      '6♠b',
      '5♠b',
      '4♠b',
      '3♠b',
      '2♠b',
      'A♠b',
      '3♠r',
      '9♠r',
      '10♠r',
      '2♠r',
      '5♦b',
      '8♦b',
      '10♦b',
      '2♣r',
      'A♣r',
      '5♣r',
      '3♣r',
      '3♣b',
      'J♣r',
      '2♥b',
      '2♥r',
      '3♥b',
      'A♥b',
      'J♥b',
      '5♥r',
      '9♥r',
      '10♥r',
    ].map((c) => Card.parse(c));
    const expectedCards = [
      '2♥r',
      '2♥b',
      '2♠r',
      '2♠b',
      '3♥b',
      '3♠r',
      '3♠b',
      '4♠b',
      '5♥r',
      '5♦b',
      '5♠b',
      '6♠b',
      '7♠b',
      '8♦b',
      '8♠b',
      '9♥r',
      '9♠r',
      '9♠b',
      '10♥r',
      '10♦b',
      '10♠r',
      '10♠b',
      'J♥b',
      'J♠b',
      'Q♠b',
      'K♠b',
      'A♥b',
      'A♠b',
      'A♦r',
      '3♣b',
      '3♣r',
      '5♣r',
      'J♣r',
      'A♣r',
      '2♣r',
    ];

    const wildCard = Card.parse('2♣r');

    const gamePlayerA = new GamePlayer(playerA, cards);

    const items = [];
    for (let i = 0; i < cards.length; ++i) {
      items.push(new DeskItem(cards[i], gamePlayerA, i));
    }

    const comparator = new DeskCardComparator(wildCard);

    // when
    const result = items.sort(comparator.deskItemComparator);

    // then
    expect(result.length).toEqual(expectedCards.length);

    // check if all left items are smaller then right
    for (let i = 0; i < result.length - 1; ++i) {
      for (let j = i + 1; j < result.length; ++j) {
        const itemA = result[i];
        const itemB = result[j];
        const compareResult = comparator.deskItemComparator(itemA, itemB);
        expect(compareResult).toBeLessThan(0);
      }
    }

    // check if all right items are greater then left
    for (let i = result.length - 1; i >= 1; --i) {
      for (let j = i - 1; j >= 0; --j) {
        const itemA = result[i];
        const itemB = result[j];
        const compareResult = comparator.deskItemComparator(itemA, itemB);
        expect(compareResult).toBeGreaterThan(0);
      }
    }

    // last card is the master wildcard
    expect(result[result.length - 1].card).toEqual(wildCard);

    expect(result.map((r) => r.card.toString())).toEqual(expectedCards);
    for (let i = 0; i < result.length; ++i) {
      expect(result[i].card.toString()).toEqual(expectedCards[i]);
    }
  });
});
