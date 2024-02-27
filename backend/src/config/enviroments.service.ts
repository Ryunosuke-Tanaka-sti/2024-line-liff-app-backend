import { MessagingApiClient } from '@line/bot-sdk/dist/messaging-api/api';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { credential } from 'firebase-admin';
import { App, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

  private firebaseApp: App;
  get firebaseAppInstance() {
    if (this.firebaseApp) return this.firebaseApp;

    this.firebaseApp = initializeApp({
      credential: credential.cert({
        projectId: String(this.configService.get('FIREBASE_PROJECT_ID')),
        privateKey: String(this.configService.get('FIREBASE_PRIVATE_KEY')),
        clientEmail: String(this.configService.get('FIREBASE_CLIENT_EMAIL')),
      }),
    });
    return this.firebaseApp;
  }

  get firestoreDB() {
    const DB = getFirestore(this.firebaseAppInstance);
    return DB;
  }
}
