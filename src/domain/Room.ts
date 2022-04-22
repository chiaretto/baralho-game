import { Game } from './Game';
import { Player } from './Player';

export class Room {
  closed: boolean;
  gameHistory: Game[];
  players: Player[];
  currentGame: Game | undefined;
  currentPlayer: Player | undefined;
  currentAdmin: Player | undefined;

  constructor() {
    this.closed = false;
    this.gameHistory = [];
    this.players = [];
    this.currentGame = undefined;
    this.currentPlayer = undefined;
  }

  scramble(dealer: Player, quantity: number) {
    this.players.forEach((p) => p.fullScore += this.currentGame?.calculateScore(p) ?? 0);

    // Limpa Mesa
    this.newGame(dealer, quantity);

    // muda o proximo jogador para o primeiro depois do dealer
    this.currentPlayer = dealer;
    this.rotatePlayer();
    this.closed = true;
  }

  setCurrentWinnerByDeskPosition(deskPosition: number): Player | undefined {
    const winner = this.getRequiredGame().setCurrentWinner(deskPosition);
    this.currentPlayer = winner?.player;

    if (winner && winner.cards.length == 0) {
      this.closed = false;
    }
    return this.currentPlayer;
  }

  removePlayerByPosition(playerPosition: number): Player | undefined {
    if (playerPosition < this.players.length) {
      const removed = this.players.splice(playerPosition, 1);
      return removed[0];
    }
    return undefined;
  }

  join(name: string, passwd: string): Player | undefined {
    const oldPlayer = Player.findPlayerByName(this.players, name);
    if (oldPlayer) {
      console.log('There is already a player named: ' + name);
      return undefined;
    }

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
    this.currentGame?.leave(player);
  }

  changeAdmin(jogador: Player, isAdmin: boolean) {
    // Setar jogador como admin
    this.currentAdmin = isAdmin ? jogador : undefined;
  }

  playCard(player: Player, playerCardPosition: number): string[] {
    const gamePlayer = this.getRequiredGame().findGamePlayer(player);
    if (gamePlayer && this.currentPlayer == player) {      
      this.getRequiredGame().playCard(gamePlayer, playerCardPosition);
      this.rotatePlayer();
    }
    return gamePlayer?.cards ?? [];
  }

  reboot() {
    this.closed = false;
    this.players = [];
    this.gameHistory = [];
    this.currentGame = undefined;
    this.currentPlayer = undefined;
  }

  findRoomPlayer(name: string, passwd: string): Player | undefined {
    const id = this.buildPlayerId(name, passwd);
    return Player.findPlayerByNameAndId(this.players, name, id);
  }

  getWildCard() : string | undefined {
    return this.currentGame?.getWildCard();
  }

  private getRequiredGame() : Game {
    if (this.currentGame) return this.currentGame;
    throw Error('Game has not been started');
  }

  private newGame(dealer: Player, quantity: number) {
    this.currentGame = new Game(dealer, this.players, quantity);
    this.gameHistory.push(this.currentGame);
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
    let nextPlayerPosition = position + 1;
    if (nextPlayerPosition >= this.players.length) {
      nextPlayerPosition = nextPlayerPosition % this.players.length;
    }
    return nextPlayerPosition;
  }

}
