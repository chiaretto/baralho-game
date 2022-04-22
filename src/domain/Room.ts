import { Deck } from './Deck';
import { Desk } from './Desk';
import { Player } from './Player';

export class Room {
  closed: boolean;
  desk: Desk;
  players: Player[];
  wildcard: string;
  currentPlayer: Player | undefined;

  constructor() {
    this.closed = false;
    this.desk = new Desk();
    this.players = [];
    this.wildcard = '';
    this.currentPlayer = undefined;
  }

  scramble(dealer: Player, quantidade: number) {    
    const scrambledDeck = Deck.getScrambled();

    // Limpa jogadores
    this.players.forEach((j) => {
      j.reset();
    });

    // Seta dealer
    dealer.dealer = true;

    // Limpa Mesa
    this.clearDesk();

    // Limpa Curinga
    this.wildcard = '';

    // Distribui as cartas
    this.players.forEach((j) => {
      j.cards = scrambledDeck.splice(0, quantidade).sort();
    });

    // Tirar Curinga
    this.wildcard = scrambledDeck.splice(0, 1)[0];

    // muda o proximo jogador para o primeiro depois do dealer
    this.currentPlayer = dealer;
    this.rotatePlayer();
  }

  setCurrentWinnerByDeskPosition(deskPosition: number): Player | undefined {
    // só permite setar ganhador quanto todos tiverem jogado na mesa
    if (!(this.desk.length() === this.players.length)) {
      console.log("Desk length != players.length");
      return undefined;
    }
    
    // verifica se todos os jogadores da mesa jogaram    
    const playersNotPlayed = this.players.filter((p) => this.desk.getPlayedCard(p) === undefined);
    if (playersNotPlayed.length > 0) {
      console.log("Players not played: " + playersNotPlayed.length);
      return undefined;
    }

    const winnerDeskItem = this.desk.getDeskItemByPosition(deskPosition);

    // identifica jogador da carta vencedora e soma ponto
    //const player = Player.findPlayerByName(this.players, playerName);
    const player = winnerDeskItem.player;
    if (player) {
      player.currentScore += 1;
    }

    // prepara para proxima rodada (limpa a mesa e proximo jogador para o vencedor)
    this.newRound();
    this.currentPlayer = player;

    return player;
  }

  removePlayerByPosition(playerPosition: number): Player | undefined {
    if (playerPosition < this.players.length) {
      const removed = this.players.splice(playerPosition, 1);
      return removed[0];
    }
    return undefined;
  }

  join(name: string, passwd: string): Player {
    const id = this.buildPlayerId(name, passwd);
    const newPlayer = new Player(id, name);
    this.players.push(newPlayer);
    return newPlayer;
  }

  leave(player: Player) {
    // se o jogador atual estiver saindo, passa a vez pro proximo
    if (player === this.currentPlayer) {
      this.rotatePlayer();
    }
    this.players = this.players.filter((j) => {
      return j != player;
    });    
  }

  changeAdmin(jogador: Player, isAdmin: boolean) {
    // Setar jogador como admin
    this.players.forEach((j) => {
      j.admin = false;
    });
    jogador.admin = isAdmin;
  }

  playCard(player: Player, playerCardPosition: number): string[] {
    if (this.currentPlayer == player) {
      const card = player.removeCardFromPosition(playerCardPosition);
      this.desk.playCard(player, card);
      this.rotatePlayer();
    }
    return player.cards;
  }

  newRound() {
    this.clearDesk();
  }

  reboot() {
    this.closed = false;
    this.wildcard = '';
    this.players = [];
    this.clearDesk();
    this.currentPlayer = undefined;
  }

  findRoomPlayer(name: string, passwd: string): Player | undefined {
    const id = this.buildPlayerId(name, passwd);
    return Player.findPlayerByNameAndId(this.players, name, id);
  }

  private clearDesk() {
    this.desk = new Desk();
  }

  private buildPlayerId(name: string, passwd: string): string {
    return name + '#' + passwd;
  }

  private rotatePlayer() {
    if (this.players.length == 0) return;
    if (this.currentPlayer) {
      this.currentPlayer = this.nextPlayerRotation(this.currentPlayer);
    } else {
      this.currentPlayer = this.players[0];
    }
  }

  private nextPlayerRotation(player: Player) : Player {
    let index = this.players.findIndex((p) => p === player);
        
    index = this.nextPlayerPosition(index);
    return this.players[index];
  }

  private nextPlayerPosition(position: number) : number {
    var nextPlayerPosition = position+1;
    if (nextPlayerPosition >= this.players.length) {
      nextPlayerPosition = nextPlayerPosition % this.players.length;
    }
    return nextPlayerPosition;
  }
}
