import { Injectable } from '@nestjs/common';
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { UtilitieDataService } from 'src/misc/feature/utilitie-data/utilitie-data.service';
import { UserQualificationDataType } from './dto/common.type';
import {
  RequestCreateDto,
  RequestUpdateDto,
  RequestUpdateManagerDto,
  RequestUpdatePersonalInfoDto,
  RequestUpdateQuantificationDto,
  RequestUpdatesSkillDto,
} from './dto/request.dto';
import { ResponseUserDto } from './dto/response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly env: EnvironmentsService,
    private readonly utilitieService: UtilitieDataService,
  ) {}
  userDB = this.env.firestoreDB.collection('users');

  userConverter: FirestoreDataConverter<ResponseUserDto> = {
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>) {
      const sl = snapshot.get('personalInfo.sl') || [];
      const manager = snapshot.get('manager') || [];
      const qualification = snapshot.get('qualification') || [];

      return {
        personalInfo: {
          displayName: snapshot.get('personalInfo.displayName') || '',
          photoURL: snapshot.get('personalInfo.photoURL') || '',
          sl: sl.map((data: string) => {
            return {
              uid: data,
              displayName: '',
            };
          }),
        },
        skills: snapshot.get('skills') || [],
        manager: manager.map((data: string) => {
          return {
            uid: data,
            displayName: '',
          };
        }),
        qualification: qualification.map((data: Omit<UserQualificationDataType, 'displayName'>) => {
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
    toFirestore(data: ResponseUserDto): DocumentData {
      return {
        personalInfo: data.personalInfo,
        skills: data.skills,
        qualification: data.qualification,
        manager: data.manager,
      };
    },
  };

  // ユーザがDB上に存在するか確認
  isExistUser = async (uid: string): Promise<boolean> => {
    const docRef = this.userDB.doc(uid);
    const doc = await docRef.get();
    return doc.exists;
  };

  convertUserData = async (user: ResponseUserDto): Promise<ResponseUserDto> => {
    const { sl, skills, qualification, manager } = await this.utilitieService.getAllData();

    user.personalInfo.sl = user.personalInfo.sl.map((target) => {
      const slData = sl.find((data) => data.uid === target.uid);
      return { ...target, displayName: slData?.displayName || '' };
    });
    user.skills = user.skills.map((target) => {
      const data = skills.find((data) => data.uid === target.uid);
      return { ...target, displayName: data?.displayName || '' };
    });
    user.qualification = user.qualification.map((target) => {
      const data = qualification.find((data) => data.uid === target.uid);
      return { ...target, displayName: data?.displayName || '' };
    });
    user.manager = user.manager.map((target) => {
      const data = manager.find((data) => data.uid === target.uid);
      return { ...target, displayName: data?.displayName || '' };
    });

    return user;
  };

  //ユーザーをDBから取得
  getUser = async (uid: string): Promise<ResponseUserDto> => {
    const docRef = this.userDB.doc(uid).withConverter(this.userConverter);
    const doc = await docRef.get();
    const user = await this.convertUserData(doc.data());
    return user;
  };

  //ユーザー情報を更新
  updateUser = async (data: RequestUpdateDto): Promise<void> => {
    const docRef = this.userDB.doc(data.uid);
    await docRef.update({
      personalInfo: data.personalInfo,
      skills: data.skills,
      qualification: data.qualification,
      manager: data.manager,
    });
  };

  updatePersonalInfo = async (data: RequestUpdatePersonalInfoDto): Promise<void> => {
    const docRef = this.userDB.doc(data.uid);
    await docRef.update({
      personalInfo: data.personalInfo,
    });
  };

  updateSkills = async (data: RequestUpdatesSkillDto): Promise<void> => {
    const docRef = this.userDB.doc(data.uid);
    await docRef.update({
      skills: data.skills,
    });
  };
  updateQualification = async (data: RequestUpdateQuantificationDto): Promise<void> => {
    const docRef = this.userDB.doc(data.uid);
    await docRef.update({
      qualification: data.qualification,
    });
  };
  updateManager = async (data: RequestUpdateManagerDto): Promise<void> => {
    const docRef = this.userDB.doc(data.uid);
    await docRef.update({
      manager: data.manager,
    });
  };

  //ユーザーをDBに追加
  createUser = async (request: RequestCreateDto): Promise<void> => {
    const docRef = this.userDB.doc(request.uid);
    await docRef.set({ personalInfo: request.personalInfo });
  };
}
