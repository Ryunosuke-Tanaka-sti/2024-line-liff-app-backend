import { Injectable } from '@nestjs/common';
import { FirestoreDataConverter } from 'firebase-admin/firestore';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { EnemyType } from 'src/types/enemyType';

@Injectable()
export class StoreEnemyService {
  constructor(private readonly env: EnvironmentsService) {}
  enemyDB = this.env.firestoreDB.collection('enemies');

  enemyConverter: FirestoreDataConverter<EnemyType> = {
    toFirestore: (enemy: EnemyType) => {
      return {
        name: enemy.name,
        prompt: enemy.prompt,
        originalContentUrl: enemy.originalContentUrl,
        previewImageUrl: enemy.previewImageUrl,
      };
    },
    fromFirestore: (snapshot) => {
      const rowData = snapshot.data() as EnemyType;
      const data: EnemyType = {
        uid: snapshot.id,
        name: rowData.name,
        prompt: rowData.prompt,
        originalContentUrl: rowData.originalContentUrl,
        previewImageUrl: rowData.previewImageUrl,
      };

      return data;
    },
  };
  async isExistEnemy(uid: string) {
    const enemy = await this.enemyDB.doc(uid).get();
    return enemy.exists;
  }
  async getEnemy(uid: string) {
    const enemyDoc = await this.enemyDB.doc(uid).withConverter(this.enemyConverter).get();
    const enemy = enemyDoc.data();
    return enemy;
  }
  async getEnemyList() {
    const enemyList = await this.enemyDB.withConverter(this.enemyConverter).get();
    return enemyList.docs.map((doc) => doc.data());
  }
}
