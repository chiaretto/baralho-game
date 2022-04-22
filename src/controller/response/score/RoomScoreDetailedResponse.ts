import { Room } from '../../../domain/Room';
import { GameScoreResponse } from './GameScoreResponse';

export class RoomScoreDetailedResponse {
  games: GameScoreResponse[];  

  constructor(room: Room) {
    this.games = room.gameHistory.map((gh) => new GameScoreResponse(gh));
  }
}