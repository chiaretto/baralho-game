import { repository } from '../../../../database/Repository';
import { Room } from '../../../../domain/Room';

export function setupGameNotForecasted(): Room {
  return setupGame(true, false);
}

export function setupGame(_start?: boolean, _forecast?: boolean): Room {
  const start = _start ?? true;
  const forecast = start && (_forecast ?? true);

  const room = new Room();

  room.join('PlayerOne', '123');
  room.join('PlayerTwo', '123');
  room.join('PlayerThr', '123');

  if (start) room.scramble(3);

  if (forecast) {
    room.setForecast(room.players[1], 2);
    room.setForecast(room.players[2], 2);
    room.setForecast(room.players[0], 2);
  }
  repository.currentRoom = room;
  return room;
}
