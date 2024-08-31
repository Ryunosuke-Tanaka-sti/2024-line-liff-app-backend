import { IsNotEmpty, IsString } from 'class-validator';

export class ResponseIndividualType {
  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsNotEmpty()
  @IsString()
  displayName: string;
}

export class ResponseAllType {
  skills: ResponseIndividualType[];
  sl: ResponseIndividualType[];
  qualification: ResponseIndividualType[];
  manager: ResponseIndividualType[];
}
