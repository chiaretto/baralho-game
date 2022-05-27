import { Room } from '../domain/Room';

class Repository {
  currentRoom: Room;

  constructor() {
    this.currentRoom = new Room();
  }
}

const repository = new Repository();

export { repository };
