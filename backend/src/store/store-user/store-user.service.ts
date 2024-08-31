import { Injectable } from '@nestjs/common';
import { FirestoreDataConverter } from 'firebase-admin/firestore';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { UserType } from 'src/types/userType';

@Injectable()
export class StoreUserService {
  constructor(private readonly env: EnvironmentsService) {}
  userDB = this.env.firestoreDB.collection('users');

  userConverter: FirestoreDataConverter<UserType> = {
    toFirestore: (user: UserType) => {
      return {
        winCount: user.winCount,
        lossCount: user.lossCount,
        hotStreak: user.hotStreak,
      };
    },
    fromFirestore: (snapshot) => {
      const rowData = snapshot.data() as UserType;
      const data: UserType = {
        uid: snapshot.id,
        winCount: rowData.winCount,
        lossCount: rowData.lossCount,
        hotStreak: rowData.hotStreak,
      };

      return data;
    },
  };
  async isExistUser(uid: string) {
    const user = await this.userDB.doc(uid).get();
    return user.exists;
  }
  async getUser(uid: string) {
    const userDoc = await this.userDB.doc(uid).withConverter(this.userConverter).get();
    const user = userDoc.data();
    return user;
  }
  async createUser(uid: string, user: UserType) {
    this.userDB.doc(uid).withConverter(this.userConverter).set(user);
  }
  async updateUser(uid: string, user: UserType) {
    this.userDB.doc(uid).withConverter(this.userConverter).update({
      winCount: user.winCount,
      lossCount: user.lossCount,
      hotStreak: user.hotStreak,
    });
  }
}
