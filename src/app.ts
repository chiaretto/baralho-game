import express, { ErrorRequestHandler } from 'express';
import logger from 'morgan';
import path from 'path';
//import cors from 'cors';
import createHttpError from 'http-errors';
import { indexRouter } from './router/IndexRouter';
import { roomRouter } from './router/RoomRouter';

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

//app.use(cors);

// Use user-defined routes;
app.use('/', indexRouter);
app.use('/salas', roomRouter);

app.use(function (req, res, next) {
  next(createHttpError(404));
});

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
