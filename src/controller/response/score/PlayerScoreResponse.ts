import { GamePlayer } from '../../../domain/GamePlayer';

export class PlayerScoreResponse {
  name: string;
  score: number;

  constructor(gamePlayer: GamePlayer) {
    this.name = gamePlayer.player.name;
    this.score = gamePlayer.computedScore();
  }
}