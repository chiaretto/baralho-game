import { GamePlayer } from '../../domain/GamePlayer';
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
  previsao?: number;

  constructor(player: Player, room: Room, gamePlayer?: GamePlayer) {
    this.nome = player.name;
    this.admin = player === room.currentAdmin;
    this.jogadorAtual = player === room.currentPlayer;

    const currentGame = room.currentGame;
    if (currentGame) {
      this.dealer = player === currentGame.dealer;

      this.perguntarPrevisao = this.jogadorAtual && !currentGame.isForecasted;
      if (this.perguntarPrevisao) {
        this.restricaoPrevisao = currentGame.getForecastRestriction(player);
      }
    } else {
      this.dealer = false;
      this.perguntarPrevisao = false;
    }

    if (gamePlayer) {
      this.cartas = gamePlayer.cards?.map((c) => c.toString());
      this.previsao = gamePlayer.forecast;
    } else {
      this.cartas = [];
    }
  }

  static fromPlayer(player: Player, room: Room) : MyRoomInfoResponse {
    const gamePlayer = room.currentGame?.findGamePlayer(player);
    return new MyRoomInfoResponse(player, room, gamePlayer);
  }

  static fromGamePlayer(gamePlayer: GamePlayer, room: Room) : MyRoomInfoResponse {
    return new MyRoomInfoResponse(gamePlayer.player, room, gamePlayer);
  }
}
