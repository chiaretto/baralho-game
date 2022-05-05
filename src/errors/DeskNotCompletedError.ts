import { Desk } from '../domain/Desk';
import { GamePlayer } from '../domain/GamePlayer';
import { CustomError } from './CustomError';

export class DeskNotCompletedError extends CustomError {
  constructor(desk: Desk, allPlayers: GamePlayer[], playersNotPlayed: GamePlayer[]) {
    super('Players not played ' + playersNotPlayed.length + ' with desk size [' + desk.length() + '] and allPlayers size [' + allPlayers.length + ']');
    this.name = 'DeskNotCompletedError';

    this.addParam('notPlayedSize', playersNotPlayed.length.toString());
    this.addParam('deskSize', desk.length().toString());
    this.addParam('allPlayersSize', allPlayers.length.toString());
  }
}