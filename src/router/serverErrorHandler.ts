import { Application, ErrorRequestHandler, Request, Response } from 'express';
import { BusinessErrorResponse } from '../controller/response/BusinessErrorResponse';
import { CustomError } from '../errors/CustomError';

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

const notFoundErrorHandler = async(req: Request, res: Response) => {
  res.status(404).send({
    error: 'Page not found!'
  });
};

const customErrors:ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(422);
    res.json({
      businessError: BusinessErrorResponse.buildFromCustomError(err)
    });
  } else {
    next(err);
  }
};

export const setupErrorHandler = (app: Application) => {  
  app.all('*', notFoundErrorHandler);
  app.use(customErrors);
  app.use(logErrors);  
  app.use(internalErrorHandler);
};