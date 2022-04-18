import { Router } from 'express';
import { indexController } from '../controller/IndexController';

const indexRouter: Router = Router();

//Routes
indexRouter.get('/', indexController.home);

export { indexRouter };
