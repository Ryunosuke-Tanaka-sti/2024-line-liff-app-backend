import { MessagingApiClient } from '@line/bot-sdk/dist/messaging-api/api';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

@Injectable()
export class EnvironmentsService {
  constructor(private configService: ConfigService) {}

  get LiffID(): string[] {
    return this.configService.get('LIFF_ID');
  }

  get ChannelID(): string {
    return this.configService.get('CHANNEL_ID');
  }

  get ChannelSecret(): string {
    return this.configService.get('BOT_CHANNEL_SECRET');
  }

  ChannelAccessToken: string = this.configService.get('BOT_CHANNEL_ACCESS_TOKEN');
  createLinebotClient() {
    const token = { channelAccessToken: this.ChannelAccessToken };
    return new MessagingApiClient(token);
  }

  FirebaseConfig: FirebaseOptions = {
    apiKey: this.configService.get('FIREBASE_API_KEY'),
    authDomain: this.configService.get('FIREBASE_AUTH_DOMAIN'),
    projectId: this.configService.get('FIREBASE_PROJECT_ID'),
    storageBucket: this.configService.get('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: this.configService.get('FIREBASE_MESSAGING_SENDER_ID'),
    appId: this.configService.get('FIREBASE_APP_ID'),
    measurementId: this.configService.get('FIREBASE_MEASUREMENT_ID'),
  };
  get firestoreDB() {
    const app = initializeApp(this.FirebaseConfig);
    const db = getFirestore(app);
    return db;
  }
}
