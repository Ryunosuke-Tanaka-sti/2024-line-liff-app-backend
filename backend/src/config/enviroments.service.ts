import { MessagingApiClient } from '@line/bot-sdk/dist/messaging-api/api';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { credential } from 'firebase-admin';
import { App, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { AzureOpenAI } from 'openai';

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

  get FirebasePrivateKey(): string {
    const privateKey: string = this.configService.get('FIREBASE_PRIVATE_KEY');
    return privateKey.replace(/\\n/gm, '\n');
  }
  get FirebaseClientEmail(): string {
    return this.configService.get('FIREBASE_CLIENT_EMAIL');
  }
  get FirebaseProjectID(): string {
    return this.configService.get('FIREBASE_PROJECT_ID');
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
        projectId: this.FirebaseProjectID,
        privateKey: this.FirebasePrivateKey,
        clientEmail: this.FirebaseClientEmail,
      }),
    });
    return this.firebaseApp;
  }

  get firestoreDB() {
    const DB = getFirestore(this.firebaseAppInstance);
    return DB;
  }

  get AOAIEndpoint(): string {
    return this.configService.get('AOAI_ENDPOINT');
  }
  get AOAIKey(): string {
    return this.configService.get('AOAI_API_KEY');
  }
  get AOAIApiVersion(): string {
    return this.configService.get('AOAI_API_VERSION');
  }

  get AOAIDeploymentsID1(): string {
    return this.configService.get('AOAI_DEPLOYMENT_ID01');
  }

  get AOAIDeploymentsID2(): string {
    return this.configService.get('AOAI_DEPLOYMENT_ID02');
  }

  AOAIClientGPT4o() {
    const client = new AzureOpenAI({
      endpoint: this.AOAIEndpoint,
      apiKey: this.AOAIKey,
      apiVersion: this.AOAIApiVersion,
      deployment: this.AOAIDeploymentsID1,
    });
    return client;
  }
  AOAIClientGPT35() {
    const client = new AzureOpenAI({
      endpoint: this.AOAIEndpoint,
      apiKey: this.AOAIKey,
      apiVersion: this.AOAIApiVersion,
      deployment: this.AOAIDeploymentsID2,
    });
    return client;
  }
}
