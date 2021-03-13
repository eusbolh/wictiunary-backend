import axios from 'axios';
import { WordDto } from '../dtos/dict.dto';
import HttpException from '../exceptions/HttpException';
import { isEmpty } from '../utils/util';

const RAPID_API_BASE_URL = 'https://wordsapiv1.p.rapidapi.com/';

class DictService {
  public async getWordDefinition(wordData: WordDto): Promise<any> {
    // TODO: remove any
    if (isEmpty(wordData)) {
      throw new HttpException(400, 'Request body is empty.');
    }

    try {
      const wordDefinition = await axios.get(`${RAPID_API_BASE_URL}/words/${wordData.word}/definitions`, {
        headers: {
          'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        },
      });

      return wordDefinition;
    } catch (error) {
      throw new HttpException(501, `An error has occurred while fetching the definition data from the dictionary API: ${error}`);
    }
  }

  public async searchWord(wordData: WordDto): Promise<any> {
    // TODO: remove any
    if (isEmpty(wordData)) {
      throw new HttpException(400, 'Request body is empty.');
    }

    try {
      const searchResults = await axios.get(`${RAPID_API_BASE_URL}/words/?letterPattern=^${wordData.word}.*$&limit=10`, {
        headers: {
          'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        },
      });

      return searchResults;
    } catch (error) {
      throw new HttpException(501, `An error has occurred while fetching the word word from the dictionary API: ${error}`);
    }
  }
}

export default DictService;
