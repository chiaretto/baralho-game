import { Player } from '../../domain/Player';
import { Room } from '../../domain/Room';

export class MyRoomInfoResponse {
  nome: string;
  cartas: string[];
  dealer: boolean;
  admin: boolean;
  jogadorAtual: boolean;
  perguntarPrevisao: boolean;
  restricaoPrevisao?: number;

  constructor(player: Player, room: Room) {
    this.nome = player.name;
    this.admin = player === room.currentAdmin;
    this.jogadorAtual = player === room.currentPlayer;

    this.dealer = player === room.currentGame?.dealer;
    this.cartas = room.currentGame?.findGamePlayer(player)?.cards ?? [];

    this.perguntarPrevisao = this.jogadorAtual && !(room.currentGame?.isForecasted ?? false);
    if (this.perguntarPrevisao) {
      this.restricaoPrevisao = room.currentGame?.getForecastRestriction(player);
    }
  }
}
