import { Card } from '../domain/Deck';
import { Desk } from '../domain/Desk';
import { CustomError } from './CustomError';

export class InvalidCardPositionError extends CustomError {
  constructor(position: number, size: number, type: 'desk' | 'hand') {
    super('Position [' + position + '] at ' + (type == 'desk' ? 'desk' : 'hand') + ' with size [' + size + '] is invalid!');
    this.name = 'InvalidCardPositionError';

    this.addParam('position', position.toString());
    this.addParam('size', size.toString());
  }

  static createFromDesk(position: number, desk: Desk) : InvalidCardPositionError {
    return new InvalidCardPositionError(position, desk.length(), 'desk');
  }
  static createFromHand(position: number, cards: Card[]) : InvalidCardPositionError {
    return new InvalidCardPositionError(position, cards.length, 'hand');
  }
}