export class PersonalInfo {
  displayName: string;
  photoURL: string;
  sl: UtilitiesDataType[];
}

export type UserSkillDataType = {
  uid: string;
  displayName: string;
  level: 0 | 1 | 2 | 3 | 4 | 5;
};
export type UserQualificationDataType = {
  uid: string;
  displayName: string;
  expiryDate?: Date;
};

export type UserManagerDataType = {
  uid: string;
  displayName: string;
};

export type UtilitiesDataType = {
  uid: string;
  displayName: string;
};

export type UtilitiesAllDataType = {
  skills: UtilitiesDataType[];
  sl: UtilitiesDataType[];
  qualification: UtilitiesDataType[];
  manager: UtilitiesDataType[];
};
