import { CustomError } from './CustomError';

export class GameNotStartedError extends CustomError {
  constructor() {
    super('Game has not been started!');
  }
}
