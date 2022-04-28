import { Application, ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';


const internalErrorHandler: ErrorRequestHandler = (err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
};

const notFoundErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404));
};

export const setupErrorHandler = (app: Application) => {  
  app.use(notFoundErrorHandler);  
  app.use(internalErrorHandler);
};