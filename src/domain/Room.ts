import { Deck } from './Deck';
import { Desk } from './Desk';
import { Player } from './Player';

export class Room {
  closed: boolean;
  desk: Desk;
  jogadores: Player[];
  curinga: string;

  constructor() {
    this.closed = false;
    this.desk = new Desk();
    this.jogadores = [];
    this.curinga = '';
  }

  scramble(dealer: Player, quantidade: number) {
    const d = new Deck();
    const scrambledDeck = d.getScrambled();

    // Limpa jogadores
    this.jogadores.forEach((j) => {
      j.reset();
    });

    // Seta dealer
    dealer.dealer = true;

    // Limpa Mesa
    this.desk = new Desk();

    // Limpa Curinga
    this.curinga = '';

    // Distribui as cartas
    this.jogadores.forEach((j) => {
      j.cards = scrambledDeck.splice(0, quantidade).sort();
    });

    // Tirar Curinga
    this.curinga = scrambledDeck.splice(0, 1)[0];
  }

  setCurrentWinnerByDeskPosition(deskPosition: number): Player | undefined {
    // só permite setar ganhador quanto todos tiverem jogado na mesa
    if (!(this.desk.length() === this.jogadores.length)) return;

    const cartaVencedora = this.desk.getCardByPosition(deskPosition);
    const playerName = cartaVencedora[0].playerName;

    // identifica jogador da carta vencedora e soma ponto
    const player = Player.findPlayerByName(this.jogadores, playerName);
    if (player) {
      player.currentScore += 1;
    }

    this.desk = new Desk();

    return player;
  }

  removePlayerByPosition(playerPosition: number): Player | undefined {
    if (playerPosition < this.jogadores.length) {
      const removed = this.jogadores.splice(playerPosition, 1);
      return removed[0];
    }
    return undefined;
  }

  join(name: string, passwd: string): Player {
    const id = this.buildPlayerId(name, passwd);
    const newPlayer = new Player(id, name);
    this.jogadores.push(newPlayer);
    return newPlayer;
  }

  leave(player: Player) {
    this.jogadores = this.jogadores.filter((j) => {
      return j != player;
    });
  }

  changeAdmin(jogador: Player, isAdmin: boolean) {
    // Setar jogador como admin
    this.jogadores.forEach((j) => {
      j.admin = false;
    });
    jogador.admin = isAdmin;
  }

  playCard(jogador: Player, playerCardPosition: number): string[] {
    const card = jogador.removeCardFromPosition(playerCardPosition);
    this.desk.jogarCarta(card, jogador.name);
    return jogador.cards;
  }

  newRound() {
    this.desk = new Desk();
  }

  reboot() {
    this.closed = false;
    this.desk = new Desk();
    this.curinga = '';
    this.jogadores = [];
  }

  findRoomPlayer(name: string, passwd: string): Player | undefined {
    const id = this.buildPlayerId(name, passwd);
    return Player.findPlayerByNameAndId(this.jogadores, name, id);
  }

  private buildPlayerId(name: string, passwd: string): string {
    return name + '#' + passwd;
  }
}
