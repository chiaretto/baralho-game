import request from 'supertest';
import { GamePlayer } from '../../../domain/GamePlayer';
import { Player } from '../../../domain/Player';
import { Room } from '../../../domain/Room';
import { BusinessErrorResponse } from '../../response/BusinessErrorResponse';

export function checkInvalidRequestError(
  result: request.Response,
  message: string
) {
  expect(result.status).toBe(400);
  expect(result.body.type).toEqual('InvalidPayload');
  expect(result.body.message).toEqual(message);
}

export function checkBusinessError(
  result: request.Response,
  errorResponse: BusinessErrorResponse
) {
  checkBusinessErrorWithStatus(422, result, errorResponse);
}
export function checkForbiddenError(
  result: request.Response,
  errorResponse: BusinessErrorResponse
) {
  checkBusinessErrorWithStatus(403, result, errorResponse);
}

export function checkBusinessErrorWithStatus(
  statusCode: number,
  result: request.Response,
  errorResponse: BusinessErrorResponse
) {
  expect(result.status).toBe(statusCode);
  expect(result.body.businessError).not.toBeUndefined();
  expect(result.body.businessError.type).toEqual(errorResponse.type);
  expect(result.body.businessError.message).toEqual(errorResponse.message);
  expect(result.body.businessError.params).toEqual(errorResponse.params);
}

export function getGamePlayer(
  room: Room,
  player?: Player
): GamePlayer | undefined {
  if (room.currentGame && room.currentPlayer) {
    return room.currentGame.findGamePlayer(player ?? room.currentPlayer);
  }
  return undefined;
}
