import { Deck } from './Deck';
import { Desk } from './Desk';
import { Player } from './Player';
import { GamePlayer } from './GamePlayer';

export class Game {
  private wildcard: string;
  private currentRound: Desk;
  private rounds: Desk[];
  private dealer: Player;
  private players: GamePlayer[];

  constructor(dealer: Player, players: Player[], quantity: number) {
    const scrambledDeck = Deck.getScrambled();        
    this.dealer = dealer;
    this.wildcard = scrambledDeck.splice(0, 1)[0];
    this.rounds = [];
    // Distribui as cartas
    this.players = players.map((p) => new GamePlayer(p, scrambledDeck.splice(0, quantity).sort()));
    this.currentRound = new Desk();
    this.newRound();
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

  newRound() {
    this.currentRound = new Desk();
    this.rounds.push(this.currentRound);
  }

  playCard(gamePlayer: GamePlayer, cardPosition: number) {
    const card = gamePlayer.removeCardFromPosition(cardPosition);
    this.currentRound.playCard(gamePlayer, card);
  }

  leave(player: Player) {
    this.players = this.players.filter((p) => p.player !== player);
  }

  calculateScore(player: Player) : number {
    return this.findGamePlayer(player)?.score ?? 0;
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