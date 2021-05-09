import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send('Magical songs of enchantment');
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
