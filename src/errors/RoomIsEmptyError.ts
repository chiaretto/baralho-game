import { CustomError } from './CustomError';

export class RoomIsEmptyError extends CustomError {
  constructor() {
    super('Room is empty!');
    this.name = 'RoomIsEmptyError';
  }
}