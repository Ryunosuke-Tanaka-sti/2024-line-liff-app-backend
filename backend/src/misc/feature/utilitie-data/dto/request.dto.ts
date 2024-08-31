import { IsNotEmpty, IsString } from 'class-validator';

export class RequestCreateDto {
  @IsNotEmpty()
  @IsString()
  displayName: string;
}
