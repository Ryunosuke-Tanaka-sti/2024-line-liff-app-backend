import { Injectable } from '@nestjs/common';
import { FirestoreDataConverter, Timestamp } from 'firebase-admin/firestore';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { LogType } from 'src/types/logType';

@Injectable()
export class LogService {
  constructor(private readonly env: EnvironmentsService) {}
  logDB = this.env.firestoreDB.collection('logs');

  logConverter: FirestoreDataConverter<LogType> = {
    toFirestore: (log: LogType) => {
      return {
        userID: log.userID,
        prompt: log.prompt,
        responseMessage: log.responseMessage,
        hasError: log.hasError,
        createdAt: log.createdAt ? log.createdAt : new Date(),
      };
    },
    fromFirestore: (snapshot) => {
      const rowData = snapshot.data() as LogType;
      const timestamp = snapshot.get('createdAt') as Timestamp;
      const createdAt = new Date(timestamp.seconds * 1000);
      const data: LogType = {
        uid: snapshot.id,
        userID: rowData.userID,
        prompt: rowData.prompt,
        responseMessage: rowData.responseMessage,
        hasError: rowData.hasError,
        createdAt: createdAt,
      };

      return data;
    },
  };
  async recordLog(log: LogType): Promise<void> {
    await this.logDB.withConverter(this.logConverter).add(log);
  }
}
