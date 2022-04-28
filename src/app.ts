import express from 'express';
import logger from 'morgan';
import path from 'path';
import cors from 'cors';
import { routes } from './router/routes';
import { setupErrorHandler } from './router/serverErrorHandler';

export const app = express();
const JOIN_PUBLIC_FOLDER = process.env.JOIN_PUBLIC_FOLDER ?? 'true';

app.use(logger('dev', {
  skip: function(req, res) { return res.statusCode < 400; }
}));
if (JOIN_PUBLIC_FOLDER == 'true') {
  app.use(express.static(path.join(__dirname, '../public')));
}
app.use(express.json());

if (process.env.RUN_LOCAL || false) {
  console.log('Using local config');
  app.use(cors({
    origin: ['http://localhost:8080']
  }));
}

// Use user-defined routes;
routes(app);

setupErrorHandler(app);
