import { Player } from '../../domain/Player';

export class MyRoomInfoResponse {
  nome: string;
  cartas: string[];
  dealer: boolean;
  admin: boolean;

  constructor(player: Player) {
    this.nome = player.name;
    this.cartas = player.cards;
    this.dealer = player.dealer;
    this.admin = player.admin;
  }
}
