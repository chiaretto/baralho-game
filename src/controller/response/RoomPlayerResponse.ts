import { Player } from '../../domain/Player';
import { Room } from '../../domain/Room';

export class RoomPlayerResponse {
  nome: string;
  quantidadeCartas: number;
  pontosRodada: number;
  previsaoRodada: number;
  dealer: boolean;
  admin: boolean;
  jogadorAtual: boolean;
  pontosTotal: number;

  constructor(player: Player, room: Room) {
    this.nome = player.name;
    this.admin = player === room.currentAdmin;
    this.jogadorAtual = player === room.currentPlayer;
    this.pontosTotal = player.fullScore;

    const gamePlayer = room.currentGame?.findGamePlayer(player);
    const game = room.currentGame;
    if (game && gamePlayer) {
      const cards = gamePlayer.cards;
      this.quantidadeCartas = cards.length;
      this.pontosRodada = gamePlayer.score;
      this.previsaoRodada = gamePlayer.forecast ?? 0;
      this.dealer = player === game.dealer;
    } else {
      this.quantidadeCartas = 0;
      this.pontosRodada = 0;
      this.previsaoRodada = 0;
      this.dealer = false;
    }
  }
}
