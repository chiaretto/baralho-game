import { Player } from '../../domain/Player';

export class MyRoomInfoResponse {
  nome: string;
  cartas: string[];
  dealer: boolean;
  admin: boolean;
  jogadorAtual: boolean;

  constructor(player: Player, currentPlayer: Player | undefined) {
    this.nome = player.name;
    this.cartas = player.cards;
    this.dealer = player.dealer;
    this.admin = player.admin;
    this.jogadorAtual = player === currentPlayer;
  }
}
