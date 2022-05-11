import { Card, Deck } from '../Deck';
import { Desk } from '../Desk';
import { GamePlayer } from '../GamePlayer';
import { Player } from '../Player';

describe('desk', () => {
  const copiedCards = [...Deck.allCards];
  const _playerOne5cardstr = copiedCards.slice(0, 5);
  const _playerTwo5cardstr = copiedCards.slice(0, 5);
  const playerOne5cards = _playerOne5cardstr.map((s) => Card.parse(s));
  const playerTwo5cards = _playerTwo5cardstr.map((s) => Card.parse(s));
  const gamePlayerOne = new GamePlayer(new Player('id123', 'PlayerOne5Cards'), playerOne5cards);
  const gamePlayerTwo = new GamePlayer(new Player('id456', 'PlayerTwo5Cards'), playerTwo5cards);

  it('should return zero length from new Desk', async() => {
    const desk = new Desk();
    expect(desk.length()).toEqual(0);
  });

  it('should return empty array of cards from new Desk', async() => {
    const desk = new Desk();
    expect(desk.getCurrentCards()).toHaveLength(0);
  });

  it('should play 1 card return the 1st card from position 0 from single sized desk', async() => {
    //given
    const desk = new Desk();
    desk.playCard(gamePlayerOne, playerOne5cards[1]);

    //when
    const deskItem = desk.getCurrentCards()[0];

    //then
    expect(deskItem.player).toEqual(gamePlayerOne);
    expect(deskItem.card).toEqual(playerOne5cards[1]);
    expect(deskItem.position).toEqual(0);
  });

  it('should play 2 cards return the 1st card from position 0 from 2 played cards', async() => {
    //given
    const desk = new Desk();
    desk.playCard(gamePlayerOne, playerOne5cards[1]);
    desk.playCard(gamePlayerTwo, playerTwo5cards[2]);

    //when
    const deskItem = desk.getCurrentCards()[0];

    //then
    expect(deskItem.player).toEqual(gamePlayerOne);
    expect(deskItem.card).toEqual(playerOne5cards[1]);
    expect(deskItem.position).toEqual(0);
  });

  it('should play 2 cards return the 2nd card from position 1 from 2 played cards', async() => {
    //given
    const desk = new Desk();
    desk.playCard(gamePlayerOne, playerOne5cards[1]);
    desk.playCard(gamePlayerTwo, playerTwo5cards[2]);

    //when
    const deskItem = desk.getCurrentCards()[1];

    //then
    expect(deskItem.player).toEqual(gamePlayerTwo);
    expect(deskItem.card).toEqual(playerTwo5cards[2]);
    expect(deskItem.position).toEqual(1);
  });

  it('should play 2 cards return the correct card from each player', async() => {
    //given
    const desk = new Desk();
    desk.playCard(gamePlayerOne, playerOne5cards[1]);
    desk.playCard(gamePlayerTwo, playerTwo5cards[2]);

    //when
    const playerOneCard = desk.getPlayedCard(gamePlayerOne);
    const playerTwoCard = desk.getPlayedCard(gamePlayerTwo);

    //then
    expect(playerOneCard?.player).toEqual(gamePlayerOne);
    expect(playerOneCard?.card).toEqual(playerOne5cards[1]);
    expect(playerOneCard?.position).toEqual(0);

    expect(playerTwoCard?.player).toEqual(gamePlayerTwo);
    expect(playerTwoCard?.card).toEqual(playerTwo5cards[2]);
    expect(playerTwoCard?.position).toEqual(1);
  });

  it('should play 1 cards return the empty played card from player 2', async() => {
    //given
    const desk = new Desk();
    desk.playCard(gamePlayerOne, playerOne5cards[1]);

    //when
    const playerOneCard = desk.getPlayedCard(gamePlayerOne);
    const playerTwoCard = desk.getPlayedCard(gamePlayerTwo);

    //then
    expect(playerOneCard?.player).toEqual(gamePlayerOne);
    expect(playerOneCard?.card).toEqual(playerOne5cards[1]);
    expect(playerOneCard?.position).toEqual(0);
    expect(playerTwoCard).toBeUndefined();
  });
});
