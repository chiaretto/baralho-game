import { CustomError } from './CustomError';

export class PlayerIsNotAdminError extends CustomError {
  constructor(playerName: string) {
    super('Player [' + playerName + '] is not the admin!');
    this.addParam('playerName', playerName);
  }
}
