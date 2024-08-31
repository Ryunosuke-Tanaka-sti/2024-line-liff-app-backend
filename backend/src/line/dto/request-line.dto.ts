import { IsNotEmpty, IsString } from 'class-validator';

export class RequestLineDto {
  @IsNotEmpty()
  @IsString()
  idToekn: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}

export class RequestLineTodoPostDto {
  @IsNotEmpty()
  @IsString()
  idToekn: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}

export class RequestUserIDDto {
  userID: string;
}

export class RequestBattleDto {
  userID: string;
  name: string;
  prompt: string;
}
