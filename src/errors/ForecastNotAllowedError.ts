import { CustomError } from './CustomError';

export class ForecastNotAllowedError extends CustomError {
  constructor(playerName: string, forecast: number) {
    super('Forecast not allowed for player ' + playerName + ' - ' + forecast + '!');
    this.addParam('playerName', playerName);
    this.addParam('forecast', forecast);
  }
}