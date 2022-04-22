import { Player } from '../../domain/Player';

export class RoomPlayerResponse {
  nome: string;
  quantidadeCartas: number;
  pontosRodada: number;
  previsaoRodada: number;
  dealer: boolean;
  admin: boolean;

  constructor(player: Player) {
    this.nome = player.name;
    this.quantidadeCartas = player.cards.length;
    this.pontosRodada = player.currentScore;
    this.previsaoRodada = player.currentForecast;
    this.dealer = player.dealer;
    this.admin = player.admin;
  }
}
