import { Desk } from '../domain/Desk';
import { CustomError } from './CustomError';

export class InvalidDeskPositionError extends CustomError {
  constructor(position: number, desk: Desk) {
    super('Position [' + position + '] at desk with size [' + desk.length() + '] is invalid!');
    this.name = 'InvalidDeskPositionError';

    this.addParam('deskPosition', position.toString());
    this.addParam('deskSize', desk.length().toString());
  }
}