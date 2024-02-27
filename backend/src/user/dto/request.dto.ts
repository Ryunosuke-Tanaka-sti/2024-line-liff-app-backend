import { IsNotEmpty, IsString } from 'class-validator';
import { PersonalInfo, UserQualificationDataType, UserSkillDataType, UtilitiesDataType } from './common.type';

export class RequestCreateDto {
  @IsNotEmpty()
  @IsString()
  uid: string;

  personalInfo: PersonalInfo;
}

export class RequestUpdateDto {
  @IsNotEmpty()
  @IsString()
  uid: string;

  personalInfo: PersonalInfo;

  skills: Omit<UserSkillDataType, 'name'>[];

  qualification: Omit<UserQualificationDataType, 'displayName'>[];

  manager: string[];
}

export class RequestUpdatePersonalInfoDto {
  @IsNotEmpty()
  @IsString()
  uid: string;

  personalInfo: {
    displayName: string;
    photoURL: string;
    sl: Omit<UtilitiesDataType, 'displayName'>[];
  };
}

export class RequestUpdatesSkillDto {
  @IsNotEmpty()
  @IsString()
  uid: string;

  skills: string[];
}

export class RequestUpdateQuantificationDto {
  @IsNotEmpty()
  @IsString()
  uid: string;

  qualification: Omit<UserQualificationDataType, 'displayName'>[];
}

export class RequestUpdateManagerDto {
  @IsNotEmpty()
  @IsString()
  uid: string;

  manager: string[];
}
