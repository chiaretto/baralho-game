import { Application, Router } from 'express';
import { indexRouter } from './IndexRouter';
import { roomRouter } from './RoomRouter';

const _routes: [string, Router][] = [
  ['/', indexRouter],
  ['/salas', roomRouter],
];

export const routes = (app: Application) => {
  _routes.forEach((r) => {
    const [url, router] = r;
    app.use(url, router);
  });
};
