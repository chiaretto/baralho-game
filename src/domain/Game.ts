import { Deck } from './Deck';
import { Desk } from './Desk';
import { Player } from './Player';
import { GamePlayer } from './GamePlayer';

export class Game {
  id: number;
  private wildcard: string;
  private currentRound: Desk;
  private dealer: Player;
  private players: GamePlayer[];
  
  isForecasted: boolean;

  constructor(dealer: Player, players: Player[], quantity: number) {
    const scrambledDeck = Deck.getScrambled();
    this.id = quantity;
    this.dealer = dealer;
    this.wildcard = scrambledDeck.splice(0, 1)[0];
    // Distribui as cartas
    this.players = players.map((p) => new GamePlayer(p, scrambledDeck.splice(0, quantity).sort()));
    this.currentRound = new Desk();
    this.newRound();
    this.isForecasted = false;
  }

  getWildCard(): string {
    return this.wildcard;
  }

  getDealer() : Player {
    return this.dealer;
  }

  getCurrentRound() {
    return this.currentRound;
  }

  getPlayers() : GamePlayer[] {
    return this.players;
  }

  newRound() {
    this.currentRound = new Desk();
  }

  playCard(gamePlayer: GamePlayer, cardPosition: number) {
    const card = gamePlayer.removeCardFromPosition(cardPosition);
    this.currentRound.playCard(gamePlayer, card);
  }

  setForecast(gamePlayer: GamePlayer, forecast: number) : boolean {
    const restriction = this.getForecastRestriction(gamePlayer.player);
    const isInvalidForecast = forecast < 0 || (restriction !== undefined && restriction === forecast);

    if (!isInvalidForecast) {
      gamePlayer.forecast = forecast;
      this.isForecasted = this.players.filter((p) => p.forecast === undefined).length == 0;
    }
    return !isInvalidForecast;
  }

  leave(player: Player) {
    this.players = this.players.filter((p) => p.player !== player);
  }

  calculateScore(player: Player) : number {
    const gamePlayer = this.findGamePlayer(player);
    return gamePlayer?.computedScore() ?? 0;
  }

  getForecastRestriction(player: Player) : number | undefined {
    if (player === this.dealer) {
      const limitSum = this.id;
      const forecastSum = this.players.map((p) => p.forecast ?? 0).reduce((a,b) => a + b, 0 );
      return limitSum - forecastSum;
    }
  }

  setCurrentWinner(deskPosition: number) {
    // só permite setar ganhador quanto todos tiverem jogado na mesa
    if (!(this.currentRound.length() === this.players.length)) {
      console.log('Desk length != players.length');
      return undefined;
    }
      
    // verifica se todos os jogadores da mesa jogaram    
    const playersNotPlayed = this.players.filter((p) => this.currentRound.getPlayedCard(p) === undefined);
    if (playersNotPlayed.length > 0) {
      console.log('Players not played: ' + playersNotPlayed.length);
      return undefined;
    }
  
    const winnerDeskItem = this.currentRound.getDeskItemByPosition(deskPosition);
  
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

  findGamePlayer(player: Player) : GamePlayer | undefined {
    return this.players.find((gp) => gp.player === player);
  }
}