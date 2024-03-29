import { DeskNotCompletedError } from '../../errors/DeskNotCompletedError';
import { Card, Deck } from '../Deck';
import { DeskItem } from '../Desk';
import { Game } from '../Game';
import { Player } from '../Player';

describe('gameSetup', () => {
  const players = [new Player('id123', 'PlayerOne'), new Player('id456', 'PlayerTwo')];
  const cards = Deck.getScrambled();

  it('should have setup new game',async () => {
    // given        
    const spiedDeck = jest.spyOn(Deck, 'getScrambled');
    spiedDeck.mockReturnValueOnce([...cards]);

    const expectedWildcardStr = cards[0];
    const expectedPlayer1Cards = [cards[1], cards[2], cards[3]].sort();
    const expectedPlayer2Cards = [cards[4], cards[5], cards[6]].sort();
    const wildCardSuit = expectedWildcardStr.slice(-2)[0];

    // when
    const game = new Game(players[0], players, 3);

    // then
    expect(game.wildCard).toEqual(Card.parse(cards[0]));
    expect(game.wildCard.suit).toEqual(wildCardSuit);
    expect(game.id).toEqual(3);
    expect(game.dealer).toBe(players[0]);
    expect(game.currentRound).not.toBeUndefined();
    expect(game.currentRound.length()).toBe(0);
    expect(game.isForecasted).toBeFalsy();

    expect(game.players).toHaveLength(2);
    expect(game.players[0].player).toBe(players[0]);
    expect(game.players[0].cards).toHaveLength(3);
    expect(game.players[1].player).toBe(players[1]);
    expect(game.players[1].cards).toHaveLength(3);

    const player1Cards = game.players[0].cards;
    for(let i = 0; i < 3; ++i) {
      const card = player1Cards[i];
      expect(card.toString()).not.toEqual(expectedWildcardStr);
      expect(card.toString()).toEqual(expectedPlayer1Cards[i]);
    }
    const player2Cards = game.players[1].cards;
    for(let i = 0; i < 3; ++i) {
      const card = player2Cards[i];
      expect(card.toString()).not.toEqual(expectedWildcardStr);
      expect(card.toString()).toEqual(expectedPlayer2Cards[i]);      
    }

    // check if players has not taken same cards
    for (let playerPosition = 0; playerPosition < game.players.length-1; ++playerPosition) {
      const player1 = game.players[playerPosition];
      for (const player1Card of player1.cards) {
        for(let player2Position = 1; player2Position < game.players.length; ++player2Position) {
          const player2 = game.players[player2Position];
          for (const player2Card of player2.cards) {
            expect(player1Card).not.toEqual(player2Card);
            expect(player1Card.toString()).not.toEqual(player2Card.toString());
          }
        }
      }
    }

  });

  it('should have different cards from different game with same players',async () => {
    // given    
    
    // when
    const game1 = new Game(players[0], players, 3);
    const game2 = new Game(players[0], players, 3);

    // then
    expect(game1.wildCard).not.toEqual(game2.wildCard);

    expect(game1.id).toEqual(3);
    expect(game2.id).toEqual(3);
    
    expect(game1.dealer).toBe(players[0]);
    expect(game2.dealer).toBe(players[0]);
    
    expect(game1.currentRound).not.toBe(game2.currentRound);

    expect(game1.players).not.toBe(game2.players);
    expect(game1.players).toHaveLength(game2.players.length);

    expect(game1.players[0].cards).toHaveLength(3);
    expect(game1.players[0].cards).not.toEqual(game2.players[0].cards);

    expect(game1.players[1].cards).toHaveLength(3);
    expect(game1.players[1].cards).not.toEqual(game2.players[1].cards);    

    expect(game1.players[0].player).toBe(game2.players[0].player);
    expect(game1.players[1].player).toBe(game2.players[1].player);
  });
});


describe('playGameCard', () => {
  const players = [new Player('id123', 'PlayerOne'), new Player('id456', 'PlayerTwo')];
  
  it('should play first card from first player',async () => {
    //given
    const game = new Game(players[0], players, 3);
    const gamePlayers = game.players;
    const firstPlayer = gamePlayers[0];
    const firstCard = firstPlayer.cards[0];

    //when
    game.playCard(firstPlayer, 0);

    //then
    expect(firstPlayer.cards).toHaveLength(2);

    expect(game.currentRound.getCurrentCards()).toHaveLength(1);
    expect(game.currentRound.getCurrentCards()).toEqual([new DeskItem(firstCard, firstPlayer, 0)]);
  });

  it('should play first card from 2 players',async () => {
    //given
    const game = new Game(players[0], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player1Card1 = player1.cards[0];
    const player2 = gamePlayers[1];
    const player2Card1 = player2.cards[0];

    //when
    game.playCard(player1, 0);
    game.playCard(player2, 0);

    //then
    expect(player1.cards).toHaveLength(2);
    expect(player2.cards).toHaveLength(2);

    expect(game.currentRound.getCurrentCards()).toHaveLength(2);
    expect(game.currentRound.getCurrentCards()).toEqual([new DeskItem(player1Card1, player1, 0), new DeskItem(player2Card1, player2, 1)]);
  });

  it('should play last index card from 2 players',async () => {
    //given
    const game = new Game(players[0], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player1Card = player1.cards[2];
    const player2 = gamePlayers[1];
    const player2Card = player2.cards[2];

    //when
    game.playCard(player1, 2);
    game.playCard(player2, 2);

    //then
    expect(player1.cards).toHaveLength(2);
    expect(player2.cards).toHaveLength(2);

    expect(game.currentRound.getCurrentCards()).toHaveLength(2);
    expect(game.currentRound.getCurrentCards()).toEqual([new DeskItem(player1Card, player1, 0), new DeskItem(player2Card, player2, 1)]);
  });

  it('should not play card if the player has already played',async () => {
    //given
    const game = new Game(players[0], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player1Card = player1.cards[2];
    const player2 = gamePlayers[1];
    const player2Card = player2.cards[2];

    //when
    game.playCard(player1, 2);
    game.playCard(player2, 2);
    game.playCard(player1, 0);

    //then
    expect(player1.cards).toHaveLength(2);
    expect(player2.cards).toHaveLength(2);

    expect(game.currentRound.getCurrentCards()).toHaveLength(2);
    expect(game.currentRound.getCurrentCards()).toEqual([new DeskItem(player1Card, player1, 0), new DeskItem(player2Card, player2, 1)]);
  });
});


describe('gameSetForecast', () => {
  const players = [new Player('id123', 'PlayerOne'), new Player('id456', 'PlayerTwo'), new Player('id789', 'PlayerThree')];

  it('should set valid forecast current first player',async () => {
    //given
    const game = new Game(players[2], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];

    //when
    const ok1 = game.setForecast(player1, 2);

    //then
    expect(ok1).toBeTruthy();
    expect(player1.forecast).toEqual(2);

    expect(game.isForecasted).toBeFalsy();
  });

  it('should set valid positive forecast last player less then maximun',async () => {
    //given
    const game = new Game(players[2], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    const player3 = gamePlayers[2];

    //when
    const ok1 = game.setForecast(player1, 0);
    const ok2 = game.setForecast(player2, 1);
    const ok3 = game.setForecast(player3, 1);

    //then
    expect(ok1).toBeTruthy();
    expect(ok2).toBeTruthy();
    expect(ok3).toBeTruthy();
    expect(player1.forecast).toEqual(0);
    expect(player2.forecast).toEqual(1);
    expect(player3.forecast).toEqual(1);

    expect(game.isForecasted).toBeTruthy();
  });

  it('should set valid positive forecast last player more then maximun',async () => {
    //given
    const game = new Game(players[2], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    const player3 = gamePlayers[2];

    //when
    const ok1 = game.setForecast(player1, 1);
    const ok2 = game.setForecast(player2, 2);
    const ok3 = game.setForecast(player3, 2);

    //then
    expect(ok1).toBeTruthy();
    expect(ok2).toBeTruthy();
    expect(ok3).toBeTruthy();
    expect(player1.forecast).toEqual(1);
    expect(player2.forecast).toEqual(2);
    expect(player3.forecast).toEqual(2);

    expect(game.isForecasted).toBeTruthy();
  });

  it('should set valid zero forecast last player less then maximun',async () => {
    //given
    const game = new Game(players[2], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    const player3 = gamePlayers[2];

    //when
    const ok1 = game.setForecast(player1, 1);
    const ok2 = game.setForecast(player2, 1);
    const ok3 = game.setForecast(player3, 0);

    //then
    expect(ok1).toBeTruthy();
    expect(ok2).toBeTruthy();
    expect(ok3).toBeTruthy();
    expect(player1.forecast).toEqual(1);
    expect(player2.forecast).toEqual(1);
    expect(player3.forecast).toEqual(0);

    expect(game.isForecasted).toBeTruthy();
  });

  it('should set valid zero forecast last player more then maximun',async () => {
    //given
    const game = new Game(players[2], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    const player3 = gamePlayers[2];

    //when
    const ok1 = game.setForecast(player1, 2);
    const ok2 = game.setForecast(player2, 2);
    const ok3 = game.setForecast(player3, 0);

    //then
    expect(ok1).toBeTruthy();
    expect(ok2).toBeTruthy();
    expect(ok3).toBeTruthy();
    expect(player1.forecast).toEqual(2);
    expect(player2.forecast).toEqual(2);
    expect(player3.forecast).toEqual(0);

    expect(game.isForecasted).toBeTruthy();
  });

  it('should set valid zero forecast last player more then maximun',async () => {
    //given
    const game = new Game(players[2], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    const player3 = gamePlayers[2];

    //when
    const ok1 = game.setForecast(player1, 2);
    const ok2 = game.setForecast(player2, 2);
    const ok3 = game.setForecast(player3, 0);

    //then
    expect(ok1).toBeTruthy();
    expect(ok2).toBeTruthy();
    expect(ok3).toBeTruthy();
    expect(player1.forecast).toEqual(2);
    expect(player2.forecast).toEqual(2);
    expect(player3.forecast).toEqual(0);

    expect(game.isForecasted).toBeTruthy();
  });

  it('should not set negative forecast',async () => {
    //given
    const game = new Game(players[2], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];

    //when
    const ok1 = game.setForecast(player1, -1);

    //then
    expect(ok1).toBeFalsy();
    expect(player1.forecast).toBeUndefined();

    expect(game.isForecasted).toBeFalsy();
  });

  it('should not set invalid forecast dealer',async () => {
    //given
    const game = new Game(players[2], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    const player3 = gamePlayers[2];

    //when
    const ok1 = game.setForecast(player1, 1);
    const ok2 = game.setForecast(player2, 1);
    const ok3 = game.setForecast(player3, 1);

    //then
    expect(ok1).toBeTruthy();
    expect(ok2).toBeTruthy();
    expect(ok3).toBeFalsy();
    expect(player1.forecast).toEqual(1);
    expect(player2.forecast).toEqual(1);
    expect(player3.forecast).toBeUndefined();

    expect(game.isForecasted).toBeFalsy();
  });

  it('should not set forecast to dealer as first player',async () => {
    //given
    const game = new Game(players[0], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];

    //when
    const ok1 = game.setForecast(player1, 1);

    //then
    expect(ok1).toBeFalsy();
    expect(player1.forecast).toBeUndefined();

    expect(game.isForecasted).toBeFalsy();
  });

  it('should not set forecast to dealer before any player',async () => {
    //given
    const game = new Game(players[1], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    const player3 = gamePlayers[2];

    //when
    const ok1 = game.setForecast(player1, 1);
    const ok2 = game.setForecast(player2, 1);
    const ok3 = game.setForecast(player3, 1);

    //then
    expect(ok1).toBeTruthy();
    expect(ok2).toBeFalsy();
    expect(ok3).toBeTruthy();
    expect(player1.forecast).toEqual(1);
    expect(player2.forecast).toBeUndefined();
    expect(player3.forecast).toEqual(1);

    expect(game.isForecasted).toBeFalsy();
  });
});


describe('gameLeave', () => {
  const players = [new Player('id123', 'PlayerOne'), new Player('id456', 'PlayerTwo'), new Player('id789', 'PlayerThree')];

  it('should leave first player not dealer',async () => {
    //given
    const game = new Game(players[2], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];

    //when
    game.leave(player1.player);

    //then
    expect(game.players).toHaveLength(2);
    expect(game.dealer).toBe(players[2]);
  });

  it('should leave mid player not dealer',async () => {
    //given
    const game = new Game(players[2], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[1];

    //when
    game.leave(player1.player);

    //then
    expect(game.players).toHaveLength(2);
    expect(game.dealer).toBe(players[2]);
  });

  it('should leave last player not dealer',async () => {
    //given
    const game = new Game(players[0], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[2];

    //when
    game.leave(player1.player);

    //then
    expect(game.players).toHaveLength(2);
    expect(game.dealer).toBe(players[0]);
  });

  it('should leave first player as dealer',async () => {
    //given
    const game = new Game(players[0], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];

    //when
    game.leave(player1.player);

    //then
    expect(game.players).toHaveLength(2);
    expect(game.dealer).toBe(players[1]);
  });

  it('should leave mid player as dealer',async () => {
    //given
    const game = new Game(players[1], players, 3);
    const gamePlayers = game.players;
    const dealer = gamePlayers[1];

    //when
    game.leave(dealer.player);

    //then
    expect(game.players).toHaveLength(2);
    expect(game.dealer).toBe(players[2]);
  });

  it('should leave last player as dealer',async () => {
    //given
    const game = new Game(players[2], players, 3);
    const gamePlayers = game.players;
    const dealer = gamePlayers[2];

    //when
    game.leave(dealer.player);

    //then
    expect(game.players).toHaveLength(2);
    expect(game.dealer).toBe(players[0]);
  });

  it('should not leave not found player',async () => {
    //given
    const game = new Game(players[2], players, 3);

    //when
    game.leave(new Player('id', 'name'));

    //then
    expect(game.players).toHaveLength(3);
    expect(game.dealer).toBe(players[2]);
  });
});

describe('gameScoreCalculate', () => {
  const players = [new Player('id123', 'PlayerOne'), new Player('id456', 'PlayerTwo'), new Player('id789', 'PlayerThree')];
  
  it('should calculate score correct forecast',async () => {
    //given
    const game = new Game(players[2], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    const player3 = gamePlayers[2];

    player1.score = 3;
    player1.forecast = 3;

    player2.score = 2;
    player2.forecast = 2;

    player3.score = 0;
    player3.forecast = 0;

    //when
    const score1 = game.calculateScore(player1.player);
    const score2 = game.calculateScore(player2.player);
    const score3 = game.calculateScore(player3.player);
  
    //then
    expect(score1).toEqual(6);
    expect(score2).toEqual(5);
    expect(score3).toEqual(3);
  });

  it('should calculate score incorrect forecast',async () => {
    //given
    const game = new Game(players[2], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    const player3 = gamePlayers[2];

    player1.score = 3;
    player1.forecast = 2;

    player2.score = 1;
    player2.forecast = 2;

    player3.score = 2;
    player3.forecast = 0;

    //when
    const score1 = game.calculateScore(player1.player);
    const score2 = game.calculateScore(player2.player);
    const score3 = game.calculateScore(player3.player);
  
    //then
    expect(score1).toEqual(0);
    expect(score2).toEqual(0);
    expect(score3).toEqual(0);
  });

  it('should calculate score not forecasted',async () => {
    //given
    const game = new Game(players[2], players, 3);
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    const player3 = gamePlayers[2];

    player1.score = 2;
    player2.score = 1;
    player3.score = 0;

    //when
    const score1 = game.calculateScore(player1.player);
    const score2 = game.calculateScore(player2.player);
    const score3 = game.calculateScore(player3.player);
  
    //then
    expect(score1).toEqual(0);
    expect(score2).toEqual(0);
    expect(score3).toEqual(0);
  });

  it('should not calculate score player not found',async () => {
    //given
    const game = new Game(players[2], players, 3);

    //when
    const score1 = game.calculateScore(new Player('novo', 'NovoPlayer'));
  
    //then
    expect(score1).toEqual(0);
  });
});

describe('getForecastRestriction', () => {
  const players = [new Player('id123', 'PlayerOne'), new Player('id456', 'PlayerTwo'), new Player('id789', 'PlayerThree')];
  const SCRAMBLE_QUANTITY = 3;

  const setupGame = () : Game => {
    return new Game(players[2], players, SCRAMBLE_QUANTITY);
  };

  it('should not have forecast restriction for not dealer and none forecast',async () => {
    //given
    const game = setupGame();
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
  
    //when
    const restriction1 = game.getForecastRestriction(player1.player);
    const restriction2 = game.getForecastRestriction(player2.player);
    
    //then
    expect(restriction1).toBeUndefined();
    expect(restriction2).toBeUndefined();
  });
    
  it('should not have forecast restriction for not dealer and some forecast done',async () => {
    //given
    const game = setupGame();
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
  
    //when
    const restriction1 = game.getForecastRestriction(player1.player);
    
    player1.forecast = 2;
    const restriction2 = game.getForecastRestriction(player2.player);
    
    //then
    expect(restriction1).toBeUndefined();
    expect(restriction2).toBeUndefined();
  });

  it('should have positive forecast restriction for dealer',async () => {
    //given
    const game = setupGame();
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    const player3 = gamePlayers[2];
  
    //when    
    player1.forecast = 2;
    player2.forecast = 0;
    const restriction3 = game.getForecastRestriction(player3.player);
    
    //then
    expect(restriction3).not.toBeUndefined();
    expect(restriction3).toEqual(1);
  });

  it('should have zero value forecast restriction for dealer',async () => {
    //given
    const game = setupGame();
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    const player3 = gamePlayers[2];
  
    //when    
    player1.forecast = 2;
    player2.forecast = 1;
    const restriction3 = game.getForecastRestriction(player3.player);
    
    //then
    expect(restriction3).not.toBeUndefined();
    expect(restriction3).toEqual(0);
  });

  it('should have negative value forecast restriction for dealer',async () => {
    //given
    const game = setupGame();
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    const player3 = gamePlayers[2];
  
    //when    
    player1.forecast = 2;
    player2.forecast = 2;
    const restriction3 = game.getForecastRestriction(player3.player);
    
    //then
    expect(restriction3).not.toBeUndefined();
    expect(restriction3).toEqual(-1);
  });
});

describe('setCurrentWinner', () => {const players = [new Player('id123', 'PlayerOne'), new Player('id456', 'PlayerTwo'), new Player('id789', 'PlayerThree')];
  const SCRAMBLE_QUANTITY = 4;

  const setupGame = () : Game => {
    return new Game(players[2], players, SCRAMBLE_QUANTITY);
  };

  beforeEach(() => {
    const cards = ['2♣r', // wildcard
      'A♦r', 'K♠b', 'Q♠b', 'J♠b', // player 0
      '10♠b', '9♠b', '8♠b', '7♠b', // player 1
      '6♠b', '5♠b', '4♠b', '3♠b', // player 2

      '2♠b', 'A♠b', '3♠r', '9♠r', '10♠r', '2♠r', '5♦b', '8♦b', '10♦b', '2♣r', 'A♣r', '5♣r', '3♣r', '3♣b', 'J♣r',
      '2♥b', '2♥r', '3♥b', 'A♥b', 'J♥b', '5♥r', '9♥r', '10♥r'];

    const spiedDeck = jest.spyOn(Deck, 'getScrambled');
    spiedDeck.mockReturnValueOnce([...cards]);
  });
     
  it('should not have winner if there is at least one player not played',async () => {
    //given
    const game = setupGame();
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    
    game.playCard(player1, 0);
    game.playCard(player2, 0);
    
    //when
    const t = () => { game.finishDesk(); };
      
    //then
    expect(t).toThrow(DeskNotCompletedError);
    expect(t).toThrow('Players not played 1 with desk size [2] and allPlayers size [3]');
    expect(game.currentRound.length()).toEqual(2);
  });

  it('should not have winner if there is no card played',async () => {
    //given
    const game = setupGame();
    
    //when
    const t = () => { game.finishDesk(); };
      
    //then
    expect(t).toThrow(DeskNotCompletedError);
    expect(t).toThrow('Players not played 3 with desk size [0] and allPlayers size [3]');
    expect(game.currentRound.length()).toEqual(0);
  });

  it('should have winner',async () => {
    //given
    const game = setupGame();
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    const player3 = gamePlayers[2];
    
    game.playCard(player1, 0);
    game.playCard(player2, 0);
    game.playCard(player3, 0);
    
    //when
    const winner = game.finishDesk();
      
    //then
    expect(winner).toBe(player1);
    expect(winner?.score).toEqual(1);
    // new round
    expect(game.currentRound.length()).toEqual(0);
  });

  it('should not have winner any player not played and desk length ok',async () => {
    //given
    const game = setupGame();
    const gamePlayers = game.players;
    const player1 = gamePlayers[0];
    const player2 = gamePlayers[1];
    
    game.playCard(player1, 0);
    // forcar jogador 1 jogar novamente (mesa invalida)
    game.currentRound.playCard(player1, player1.cards[1]);
    game.playCard(player2, 0);
    
    //when
    const t = () => { game.finishDesk(); };
      
    //then
    expect(t).toThrow(DeskNotCompletedError);
    expect(t).toThrow('Players not played 1 with desk size [3] and allPlayers size [3]');
    expect(game.currentRound.length()).toEqual(3);
  });
});
