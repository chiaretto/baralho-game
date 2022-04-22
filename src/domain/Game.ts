import { Deck } from './Deck';
import { Desk } from './Desk';
import { Player } from './Player';

export class Game {
  private wildcard: string;
  private currentRound: Desk;
  private rounds: Desk[];
  private dealer: Player;
  private players: Player[];
  private quantity: number;

  constructor(dealer: Player, players: Player[], quantity: number) {
    const scrambledDeck = Deck.getScrambled();        
    this.dealer = dealer;
    this.quantity = quantity;
    this.wildcard = scrambledDeck.splice(0, 1)[0];
    this.rounds = [];
    this.players = players;
    this.currentRound = new Desk();

    // Seta dealer
    dealer.dealer = true;

    // Distribui as cartas
    this.players.forEach((j) => {
      j.cards = scrambledDeck.splice(0, quantity).sort();
    });
  }

  getWildCard(): string {
    return this.wildcard;
  }

  newRound() {
    this.currentRound = new Desk();
    this.rounds.push(this.currentRound);
  }

  getCurrentRound() {
    return this.currentRound;
  }

  playCard(player: Player, card: string) {
    this.currentRound.playCard(player, card);
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
      player.currentScore += 1;
    }
  
    // prepara para proxima rodada (limpa a mesa)
    this.newRound();
  
    return player;
  }
}