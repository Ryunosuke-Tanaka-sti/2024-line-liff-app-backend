import { IsNotEmpty, IsString } from 'class-validator';
import { PersonalInfo, UserManagerDataType, UserQualificationDataType, UserSkillDataType } from './common.type';

export class ResponsetDto {
  @IsNotEmpty()
  @IsString()
  uid: string;
}

export class ResponseUserDto {
  personalInfo: PersonalInfo;

  skills: UserSkillDataType[];

  qualification: UserQualificationDataType[];

  manager: UserManagerDataType[];
}
