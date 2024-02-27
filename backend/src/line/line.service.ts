import { Injectable } from '@nestjs/common';

import { DocumentData, FieldValue, FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { EnvironmentsService } from 'src/config/enviroments.service';
import type { todoType } from '../types/todoType';

@Injectable()
export class LineService {
  constructor(private readonly env: EnvironmentsService) {}
  todoDB = this.env.firestoreDB.collection('todo');

  todoConverter: FirestoreDataConverter<todoType> = {
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): todoType {
      return {
        uid: snapshot.id,
        userID: snapshot.get('userID'),
        text: snapshot.get('text'),
        done: snapshot.get('done'),
        timestamp: snapshot.get('timestamp'),
      };
    },
    toFirestore(todo: todoType): DocumentData {
      return {
        userID: todo.userID,
        text: todo.text,
        done: todo.done,
        timestamp: todo.timestamp,
      };
    },
  };

  createTodo = async (todo: Omit<todoType, 'uid' | 'timestamp'>): Promise<void> => {
    const collRef = this.todoDB.withConverter(this.todoConverter);
    await collRef.add({ uid: '', ...todo, timestamp: FieldValue.serverTimestamp() });
  };

  readTodo = async (): Promise<todoType[]> => {
    const collRef = this.todoDB.withConverter(this.todoConverter);
    const snapshot = await collRef.get();
    const result = snapshot.docs.map((doc) => doc.data());
    return result;
  };

  updateTodo = async (todo: todoType): Promise<void> => {
    const collRef = this.todoDB;
    const docRef = collRef.doc(todo.uid).withConverter(this.todoConverter);
    await docRef.update({ ...todo });
  };

  deleteTodo = async (uid: string): Promise<void> => {
    const collRef = this.todoDB;
    const docRef = collRef.doc(uid);
    await docRef.delete();
  };
}
