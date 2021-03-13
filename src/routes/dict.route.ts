import { Router } from 'express';
import DictController from '../controllers/dict.controller';
import Route from '../interfaces/routes.interface';

class DictRoute implements Route {
  public path = '/dict';
  public router = Router();
  public dictController = new DictController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/search`, this.dictController.searchWord);
    this.router.post(`${this.path}/definition`, this.dictController.getWordDefinition);
  }
}

export default DictRoute;
