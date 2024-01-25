import { MessagingApiClient } from '@line/bot-sdk/dist/messaging-api/api';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

  get ChannelAccessToken(): string {
    return this.configService.get('BOT_CHANNEL_ACCESS_TOKEN');
  }

  createLinebotClient() {
    const token = { channelAccessToken: this.ChannelAccessToken };
    return new MessagingApiClient(token);
  }
}
