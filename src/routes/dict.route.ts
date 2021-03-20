import { Router } from 'express';
import DictController from '../controllers/dict.controller';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';

class DictRoute implements Route {
  public path = '/dict';
  public router = Router();
  public dictController = new DictController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/search`, authMiddleware, this.dictController.searchWord);
    this.router.post(`${this.path}/definition`, authMiddleware, this.dictController.getWordDefinition);
  }
}

export default DictRoute;
