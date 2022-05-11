import { CustomError } from './CustomError';

export class PlayerAlreadyExistsError extends CustomError {
  constructor(playerName: string) {
    super('Player with name [' + playerName + '] has already joined the room!');
    this.addParam('playerName', playerName);
  }
}