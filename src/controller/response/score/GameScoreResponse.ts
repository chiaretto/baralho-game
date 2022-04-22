import { Game } from '../../../domain/Game';
import { PlayerScoreResponse } from './PlayerScoreResponse';

export class GameScoreResponse {
  id:number;
  playerScores: PlayerScoreResponse[];

  constructor(game: Game) {
    this.id = game.id;
    this.playerScores = game.getPlayers().map((p) => new PlayerScoreResponse(p));
  }
}