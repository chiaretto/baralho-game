import { CustomError } from './CustomError';

export class GameNotForecastedError extends CustomError {
  constructor() {
    super('Game is not forecasted!');
    this.name = 'GameNotForecastedError';
  }
}