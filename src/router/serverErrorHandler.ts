import { Application, ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  next(err);
};

const internalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.json({
    message: err.message,
    name: err.name,
    error: err
  });
};

const notFoundErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404));
};

export const setupErrorHandler = (app: Application) => {  
  app.use(notFoundErrorHandler);
  app.use(logErrors);
  app.use(internalErrorHandler);
};