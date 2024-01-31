import { Injectable } from '@nestjs/common';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { EnvironmentsService } from 'src/config/enviroments.service';
import type { todoType } from '../types/todoType';

@Injectable()
export class LineService {
  constructor(private readonly env: EnvironmentsService) {}

  todoConverter: FirestoreDataConverter<todoType> = {
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): todoType {
      const data = snapshot.data(options);
      return {
        uid: snapshot.id,
        userID: data.userID,
        done: data.done,
        text: data.text,
        timestamp: data.timestamp.toDate(),
      };
    },
    toFirestore(todo: todoType): DocumentData {
      return {
        userID: todo.userID,
        text: todo.text,
        done: todo.done,
        timestamp: todo.timestamp ? todo.timestamp : serverTimestamp(),
      };
    },
  };

  createTodo = async (todo: Omit<todoType, 'uid' | 'timestamp'>): Promise<void> => {
    const collRef = collection(this.env.firestoreDB, 'todo').withConverter(this.todoConverter);
    await addDoc(collRef, todo);
  };

  readTodo = async (): Promise<todoType[]> => {
    const collRef = collection(this.env.firestoreDB, 'todo').withConverter(this.todoConverter);
    const snapshot = await getDocs(collRef);
    const result = snapshot.docs.map((doc) => doc.data());
    return result;
  };

  updateTodo = async (todo: todoType): Promise<void> => {
    const collRef = collection(this.env.firestoreDB, 'todo');
    const docRef = doc(collRef, todo.uid);
    await setDoc(docRef, todo);
  };

  deleteTodo = async (uid: string): Promise<void> => {
    const collRef = collection(this.env.firestoreDB, 'todo');
    const docRef = doc(collRef, uid);
    await deleteDoc(docRef);
  };
}
