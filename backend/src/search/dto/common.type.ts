export type UserHasSkills = {
  uid: string;
  displayName: string;
  skills: {
    uid: string;
    displayName: string;
    level: number;
  }[];
};

export type UserHasManager = {
  uid: string;
  displayName: string;
  manager: string[];
};

export type UserHasQualification = {
  uid: string;
  displayName: string;
  qualification: {
    uid: string;
    expiryDate?: Date;
  }[];
};
