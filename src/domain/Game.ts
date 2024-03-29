import { Card, Deck } from './Deck';
import { Desk, DeskItem } from './Desk';
import { Player } from './Player';
import { GamePlayer } from './GamePlayer';
import { InvalidCardPositionError } from '../errors/InvalidCardPositionError';
import { DeskNotCompletedError } from '../errors/DeskNotCompletedError';
import { DeskCardComparator } from '../util/DeskCardComparator';

export class Game {
  id: number;
  private _wildcard: Card;
  private _currentRound: Desk;
  private _dealer: Player;
  private _players: GamePlayer[];
  private _isForecasted: boolean;

  constructor(dealer: Player, players: Player[], quantity: number) {
    const scrambledDeck = Deck.getScrambled();
    this.id = quantity;
    this._dealer = dealer;
    this._wildcard = Card.parse(scrambledDeck.splice(0, 1)[0]);

    // Distribui as cartas
    this._players = players.map(
      (p) => new GamePlayer(p, this.buildPlayerCards(scrambledDeck, quantity))
    );
    this._currentRound = new Desk();
    this.newRound();
    this._isForecasted = false;
  }

  get wildCard(): Card {
    return this._wildcard;
  }

  get dealer(): Player {
    return this._dealer;
  }

  get currentRound() {
    return this._currentRound;
  }

  get players(): GamePlayer[] {
    return this._players;
  }

  get isForecasted(): boolean {
    return this._isForecasted;
  }

  newRound() {
    this._currentRound = new Desk();
  }

  playCard(gamePlayer: GamePlayer, cardPosition: number) {
    if (this._currentRound.getPlayedCard(gamePlayer) == undefined) {
      if (gamePlayer.cards.length <= cardPosition) {
        throw InvalidCardPositionError.createFromHand(
          cardPosition,
          gamePlayer.cards
        );
      }
      const card = gamePlayer.removeCardFromPosition(cardPosition);
      this._currentRound.playCard(gamePlayer, card);
    } else {
      console.debug(
        'Player ' + gamePlayer.player.name + ' has already played a card'
      );
    }
  }

  setForecast(gamePlayer: GamePlayer, forecast: number): boolean {
    if (forecast < 0) return false;
    if (forecast > this.id) return false;

    const isLastForecaster =
      this._players.filter((p) => p.forecast === undefined).length == 1;

    if (gamePlayer.player == this.dealer) {
      const restriction = this.getForecastRestriction(gamePlayer.player);
      // Se a previsão é igual a restrição, ou ainda faltam outros jogadores para prever,
      // não é valida a previsão
      if (restriction === forecast || !isLastForecaster) {
        //console.log('Dealer must be the last one to forecast and cannot be ' + restriction);
        return false;
      }
    }

    gamePlayer.forecast = forecast;
    this._isForecasted = isLastForecaster;

    return true;
  }

  leave(player: Player) {
    const idx = this._players.findIndex((p) => p.player === player);
    if (idx < 0) return;

    this._players.splice(idx, 1);

    if (player == this._dealer) {
      this._dealer = this._players[idx % this._players.length].player;
    }
  }

  calculateScore(player: Player): number {
    const gamePlayer = this.findGamePlayer(player);
    return gamePlayer?.computedScore() ?? 0;
  }

  getForecastRestriction(player: Player): number | undefined {
    if (player === this.dealer) {
      const limitSum = this.id;
      const forecastSum = this._players
        .map((p) => p.forecast ?? 0)
        .reduce((a, b) => a + b, 0);
      return limitSum - forecastSum;
    }
  }

  finishDesk(): GamePlayer {
    // só permite setar ganhador quanto todos tiverem jogado na mesa
    // verifica se todos os jogadores da mesa jogaram
    const playersNotPlayed = this._players.filter(
      (p) => this._currentRound.getPlayedCard(p) === undefined
    );
    if (
      playersNotPlayed.length > 0 ||
      this._currentRound.length() != this._players.length
    ) {
      throw new DeskNotCompletedError(
        this._currentRound,
        this._players,
        playersNotPlayed
      );
    }

    const winnerDeskItem = this.getWinner();

    // identifica jogador da carta vencedora e soma ponto
    //const player = Player.findPlayerByName(this.players, playerName);
    const player = winnerDeskItem.player;
    if (player) {
      player.score += 1;
    }

    // prepara para proxima rodada (limpa a mesa)
    this.newRound();

    return player;
  }

  findGamePlayer(player: Player): GamePlayer | undefined {
    return this._players.find((gp) => gp.player === player);
  }

  private buildPlayerCards(scrambledDeck: string[], quantity: number): Card[] {
    const subCards = scrambledDeck.splice(0, quantity).sort();
    return subCards.map((s) => Card.parse(s));
  }

  private getWinner(): DeskItem {
    const list = this._currentRound.getCurrentCards();
    const comparator = new DeskCardComparator(this._wildcard);

    list.sort(comparator.deskItemComparator).reverse();
    return list[0];
  }
}
