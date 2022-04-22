import { Deck } from './Deck';
import { Desk } from './Desk';
import { Player } from './Player';

export class Room {
  closed: boolean;
  desk: Desk;
  players: Player[];
  wildcard: string;

  constructor() {
    this.closed = false;
    this.desk = new Desk();
    this.players = [];
    this.wildcard = '';
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
  }

  setCurrentWinnerByDeskPosition(deskPosition: number): Player | undefined {
    // só permite setar ganhador quanto todos tiverem jogado na mesa
    if (!(this.desk.length() === this.players.length)) return;

    const winnerDeskItem = this.desk.getDeskItemByPosition(deskPosition);

    // identifica jogador da carta vencedora e soma ponto
    //const player = Player.findPlayerByName(this.players, playerName);
    const player = winnerDeskItem.player;
    if (player) {
      player.currentScore += 1;
    }

    this.clearDesk();

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
    const card = player.removeCardFromPosition(playerCardPosition);
    this.desk.playCard(player, card);
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
}
