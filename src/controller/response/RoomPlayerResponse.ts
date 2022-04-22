import { Player } from '../../domain/Player';

export class RoomPlayerResponse {
  nome: string;
  quantidadeCartas: number;
  pontosRodada: number;
  previsaoRodada: number;
  dealer: boolean;
  admin: boolean;
  jogadorAtual: boolean;

  constructor(player: Player, currentPlayer: Player | undefined) {
    this.nome = player.name;
    this.quantidadeCartas = player.cards.length;
    this.pontosRodada = player.currentScore;
    this.previsaoRodada = player.currentForecast;
    this.dealer = player.dealer;
    this.admin = player.admin;
    this.jogadorAtual = player === currentPlayer;
  }
}
