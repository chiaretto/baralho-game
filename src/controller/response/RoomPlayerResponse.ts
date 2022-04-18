import { Player } from '../../domain/Player';

export class RoomPlayerResponse {
  nome: string;
  quantidadeCartas: number;
  pontosRodada: number;
  previsaoRodada: number;
  dealer: boolean;
  admin: boolean;

  constructor(jogador: Player) {
    this.nome = jogador.name;
    this.quantidadeCartas = jogador.cards.length;
    this.pontosRodada = jogador.currentScore;
    this.previsaoRodada = jogador.currentForecast;
    this.dealer = jogador.dealer;
    this.admin = jogador.admin;
  }
}
