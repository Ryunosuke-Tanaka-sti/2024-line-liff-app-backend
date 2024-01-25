import { IsNotEmpty, IsString } from 'class-validator';

export class RequestLineDto {
  @IsNotEmpty()
  @IsString()
  idToekn: string;
}
