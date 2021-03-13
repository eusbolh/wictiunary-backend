import { NextFunction, Request, Response } from 'express';
import { WordDto } from '../dtos/dict.dto';
import DictService from '../services/dict.service';

class DictController {
  public dictService = new DictService();

  public getWordDefinition = async (req: Request, res: Response, next: NextFunction) => {
    const wordData: WordDto = req.body;

    try {
      const wordDefinition = await this.dictService.getWordDefinition(wordData);
      return res.status(200).json(wordDefinition.data);
    } catch (error) {
      next(error);
    }
  };

  public searchWord = async (req: Request, res: Response, next: NextFunction) => {
    const wordData: WordDto = req.body;

    try {
      const searchResults = await this.dictService.searchWord(wordData);
      return res.status(200).json(searchResults.data);
    } catch (error) {
      next(error);
    }
  };
}

export default DictController;
