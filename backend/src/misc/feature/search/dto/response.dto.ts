import { UserHasSkills } from './common.type';

export class ResponseUserSkillDto {
  users: UserHasSkills[];
  utilities: {
    skills: {
      uid: string;
      displayName: string;
    }[];
  };
}

export class ResponseUserManagerDto {
  managers: {
    uid: string;
    displayName: string;
    manager: {
      uid: string;
      displayName: string;
    };
  }[];
  utilities: {
    managers: {
      uid: string;
      displayName: string;
    }[];
  };
}

export class ResponseUserQualificationDto {
  qualifications: {
    uid: string;
    displayName: string;
    qualification: {
      uid: string;
      displayName: string;
      expiryDate?: Date;
    };
  }[];
  utilities: {
    qualifications: {
      uid: string;
      displayName: string;
    }[];
  };
}
