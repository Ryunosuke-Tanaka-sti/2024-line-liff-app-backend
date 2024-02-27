import { Injectable } from '@nestjs/common';
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { ResponseAllType, ResponseIndividualType } from './dto/response.dto';

@Injectable()
export class UtilitieDataService {
  constructor(private readonly env: EnvironmentsService) {}

  utilitieConverter: FirestoreDataConverter<ResponseIndividualType> = {
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): ResponseIndividualType {
      return {
        uid: snapshot.id,
        displayName: snapshot.get('displayName'),
      };
    },
    toFirestore(data: ResponseIndividualType): DocumentData {
      return {
        displayName: data.displayName,
      };
    },
  };

  isExistDataByName = async (utilitieName: string, displayName: string): Promise<boolean> => {
    const DB = this.env.firestoreDB.collection(utilitieName);
    const snapshot = await DB.where('displayName', '==', displayName).get();
    return !snapshot.empty;
  };
  isExistDataByUid = async (utilitieName: string, uid: string): Promise<boolean> => {
    const DB = this.env.firestoreDB.collection(utilitieName);
    const docRef = DB.doc(uid);
    const doc = await docRef.get();
    return doc.exists;
  };

  getAllData = async (): Promise<ResponseAllType> => {
    const SL = this.env.firestoreDB.collection('sl');
    const Skill = this.env.firestoreDB.collection('skill');
    const Qualification = this.env.firestoreDB.collection('qualification');
    const Manager = this.env.firestoreDB.collection('manager');

    const snapshots = [
      SL.withConverter(this.utilitieConverter).get(),
      Skill.withConverter(this.utilitieConverter).get(),
      Qualification.withConverter(this.utilitieConverter).get(),
      Manager.withConverter(this.utilitieConverter).get(),
    ];
    const [slSnapshot, skillSnapshot, qualificationSnapshot, manager] = await Promise.all(snapshots);
    return {
      sl: slSnapshot.docs.map((doc) => doc.data()),
      skills: skillSnapshot.docs.map((doc) => doc.data()),
      qualification: qualificationSnapshot.docs.map((doc) => doc.data()),
      manager: manager.docs.map((doc) => doc.data()),
    };
  };

  getIndividualAllData = async (utilitieName: string): Promise<ResponseIndividualType[]> => {
    const DB = this.env.firestoreDB.collection(utilitieName);
    const snapshot = await DB.withConverter(this.utilitieConverter).get();
    return snapshot.docs.map((doc) => doc.data());
  };
  createUtilitieData = async (utilitieName: string, data: Omit<ResponseIndividualType, 'uid'>): Promise<void> => {
    const DB = this.env.firestoreDB.collection(utilitieName);
    const collRef = DB.withConverter(this.utilitieConverter);
    await collRef.add({ uid: '', ...data });
  };
  updateSlData = async (utilitieName: string, data: ResponseIndividualType): Promise<void> => {
    const DB = this.env.firestoreDB.collection(utilitieName);
    const docRef = DB.doc(data.uid).withConverter(this.utilitieConverter);
    await docRef.update({ displayName: data.displayName });
  };
  deleteSlData = async (utilitieName: string, uid: string): Promise<void> => {
    const DB = this.env.firestoreDB.collection(utilitieName);
    const docRef = DB.doc(uid);
    await docRef.delete();
  };
}
