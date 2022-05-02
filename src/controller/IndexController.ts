import { Request, Response } from 'express';

class IndexController {
  public home(req: Request, res: Response) {
    return res.send({ data: 'Express + TypeScript Server' });
  }
}

export const indexController = new IndexController();
