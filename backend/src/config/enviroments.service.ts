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
}
