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
