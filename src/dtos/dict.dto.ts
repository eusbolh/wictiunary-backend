import { IsString } from 'class-validator';

export class WordDto {
  @IsString()
  public word: string;
}
