import { Injectable } from '@nestjs/common';
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { UtilitieDataService } from 'src/utilitie-data/utilitie-data.service';
import { UserHasManager, UserHasQualification, UserHasSkills } from './dto/common.type';
import { ResponseUserManagerDto, ResponseUserQualificationDto, ResponseUserSkillDto } from './dto/response.dto';

@Injectable()
export class SearchService {
  constructor(
    private readonly env: EnvironmentsService,
    private readonly utilitieService: UtilitieDataService,
  ) {}
  userDB = this.env.firestoreDB.collection('users');

  userSkillsConverter: FirestoreDataConverter<UserHasSkills> = {
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>) {
      const skills = snapshot.get('skills') || [];
      return {
        uid: snapshot.id,
        displayName: snapshot.get('personalInfo.displayName') || '',
        skills: skills.map((data: { uid: string; level: number }) => {
          return {
            uid: data.uid,
            displayName: '',
            level: data.level,
          };
        }),
      };
    },
    toFirestore(): DocumentData {
      return {};
    },
  };

  convertSkills = async (users: UserHasSkills[]): Promise<ResponseUserSkillDto> => {
    const skills = await this.utilitieService.getIndividualAllData('skill');
    const usersWithSkillsHasDisplayName = users.map((user) => {
      const userSkills = skills.map((skill) => {
        const userSkill = user.skills.find((userSkill) => userSkill.uid === skill.uid);
        if (!userSkill) return { ...skill, level: 0 };
        return {
          ...skill,
          level: userSkill.level,
        };
      });
      return {
        ...user,
        skills: userSkills,
      };
    });
    return {
      users: usersWithSkillsHasDisplayName,
      utilities: {
        skills,
      },
    };
  };

  getAllUsersSkills = async (): Promise<ResponseUserSkillDto> => {
    const usersCollection = await this.userDB.withConverter(this.userSkillsConverter).get();
    const users = usersCollection.docs.map((doc) => doc.data());
    return this.convertSkills(users);
  };
  getUsersQuerySkills = async (skills: string[]): Promise<ResponseUserSkillDto> => {
    // 一度に検索可能数の上限が30件
    // Levelをすべて検索すると1,2,3,4,5の5件検索が必要 同時検索は5件
    // const queryString = [];
    // skills.forEach((skill) => {
    //   const temp = [1, 2, 3, 4, 5].map((level) => {
    //     return { uid: skill, level: level };
    //   });
    //   queryString.push(...temp);
    // });

    // const usersCollection = await this.userDB
    //   .withConverter(this.userSkillsConverter)
    //   .where('skills', 'array-contains-any', queryString)
    //   .get();

    // AND検索
    const usersCollection = await this.userDB.withConverter(this.userSkillsConverter).get();
    const users = usersCollection.docs.map((doc) => doc.data());
    const usersHasTargetSkills = users.filter((user) => {
      return skills.every((skill) => user.skills.some((userSkill) => userSkill.uid === skill));
    });
    return this.convertSkills(usersHasTargetSkills);
  };

  userManagersConverter: FirestoreDataConverter<UserHasManager> = {
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>) {
      const manager = snapshot.get('manager') || [];
      return {
        uid: snapshot.id,
        displayName: snapshot.get('personalInfo.displayName') || '',
        manager: manager,
      };
    },
    toFirestore(): DocumentData {
      return {};
    },
  };
  convertManagers = async (users: UserHasManager[]): Promise<ResponseUserManagerDto> => {
    const manager = await this.utilitieService.getIndividualAllData('manager');
    const usersWithManagerHasDisplayName: ResponseUserManagerDto['managers'] = [];
    users.forEach((user) => {
      user.manager.forEach((userManagerUID) => {
        const data = manager.find((manager) => manager.uid === userManagerUID);
        if (!data) return;
        usersWithManagerHasDisplayName.push({
          uid: user.uid,
          displayName: user.displayName,
          manager: {
            uid: data.uid,
            displayName: data.displayName,
          },
        });
      });
    });
    return { managers: usersWithManagerHasDisplayName, utilities: { managers: manager } };
  };

  getAllUsersManagers = async (): Promise<ResponseUserManagerDto> => {
    const usersCollection = await this.userDB
      .withConverter(this.userManagersConverter)
      .where('manager', 'not-in', [''])
      .get();
    const users = usersCollection.docs.map((doc) => doc.data());
    return this.convertManagers(users);
  };
  getUsersQueryManagers = async (manager: string[]): Promise<ResponseUserManagerDto> => {
    const usersCollection = await this.userDB
      .withConverter(this.userManagersConverter)
      .where('manager', 'array-contains-any', manager)
      .get();
    const users = usersCollection.docs.map((doc) => doc.data());

    const userRelatedQualification = await this.convertManagers(users);
    const usersQueryQualification = userRelatedQualification.managers.filter((user) => {
      return manager.some((query) => user.manager.uid === query);
    });

    return { managers: usersQueryQualification, utilities: userRelatedQualification.utilities };
  };

  //userQualificationConverterのひな形を作成
  userQualificationConverter: FirestoreDataConverter<UserHasQualification> = {
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>) {
      const qualification = snapshot.get('qualification') || [];
      return {
        uid: snapshot.id,
        displayName: snapshot.get('personalInfo.displayName') || '',
        qualification: qualification.map((data: { uid: string; expiryDate: Date }) => {
          if (!data.expiryDate) {
            return {
              uid: data.uid,
            };
          }
          return {
            uid: data.uid,
            expiryDate: new Date(data.expiryDate),
          };
        }),
      };
    },
    toFirestore(): DocumentData {
      return {};
    },
  };

  convertQualification = async (users: UserHasQualification[]): Promise<ResponseUserQualificationDto> => {
    const qualification = await this.utilitieService.getIndividualAllData('qualification');
    const usersWithQualificationHasDisplayName: ResponseUserQualificationDto['qualifications'] = [];
    users.forEach((user) => {
      user.qualification.forEach((userQualification) => {
        const data = qualification.find((qualification) => qualification.uid === userQualification.uid);
        if (!data) return;
        usersWithQualificationHasDisplayName.push({
          uid: user.uid,
          displayName: user.displayName,
          qualification: {
            uid: data.uid,
            displayName: data.displayName,
            expiryDate: userQualification.expiryDate,
          },
        });
      });
    });
    return { qualifications: usersWithQualificationHasDisplayName, utilities: { qualifications: qualification } };
  };

  getAllUsersQuanlification = async (): Promise<ResponseUserQualificationDto> => {
    const usersCollection = await this.userDB
      .withConverter(this.userQualificationConverter)
      .where('qualification', 'not-in', [''])
      .get();
    const users = usersCollection.docs.map((doc) => doc.data());
    return this.convertQualification(users);
  };

  getUsersQueryQualification = async (qualification: string[]): Promise<ResponseUserQualificationDto> => {
    const usersCollection = await this.userDB
      .withConverter(this.userQualificationConverter)
      .where('qualification', 'not-in', [''])
      .get();
    const users = usersCollection.docs.map((doc) => doc.data());
    const usersAllQualification = await this.convertQualification(users);
    const usersQueryQualification = usersAllQualification.qualifications.filter((user) => {
      return qualification.some((query) => user.qualification.uid === query);
    });

    return { qualifications: usersQueryQualification, utilities: usersAllQualification.utilities };
  };
}
