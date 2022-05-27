import { CustomError } from './CustomError';

export class PlayerNotFoundError extends CustomError {
  constructor(name: string) {
    super('Player with name [' + name + '] not found!');
    this.name = 'PlayerNotFoundError';

    this.addParam('playerName', name);
  }
}
