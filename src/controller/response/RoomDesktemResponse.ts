export class RoomDeskItemResponse {
  carta: string;
  jogador: string;

  constructor(carta: string, jogador: string) {
    this.carta = carta;
    this.jogador = jogador;
  }
}
