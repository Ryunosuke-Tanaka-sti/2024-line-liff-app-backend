import { TextEventMessage } from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import { EnvironmentsService } from 'src/config/enviroments.service';

@Injectable()
export class LineBotService {
  constructor(private readonly env: EnvironmentsService) {}

  async replyParrot(replyToken: string, textEventMessage: TextEventMessage): Promise<void> {
    const client = this.env.createLinebotClient();

    client.replyMessage({
      replyToken: replyToken,
      messages: [
        { type: 'text', text: 'Hello World!' },
        { type: 'text', text: textEventMessage.text },
      ],
    });
    return;
  }
}
