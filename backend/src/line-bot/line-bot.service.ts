import { TextEventMessage } from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { LogService } from 'src/store/log/log.service';
import { AoaiPromptService } from 'src/utils/aoai-prompt/aoai-prompt.service';

@Injectable()
export class LineBotService {
  constructor(
    private readonly env: EnvironmentsService,
    private readonly prompt: AoaiPromptService,
    private readonly log: LogService,
  ) {}

  async replayAOAI(userID: string, replyToken: string, textEventMessage: TextEventMessage): Promise<void> {
    const client = this.env.createLinebotClient();
    const temp = await this.prompt.tutorialBattlesPropmpt(textEventMessage.text);
    console.log(temp);

    try {
      console.log('-----------------------------');
      const result = await this.prompt.jsonFormatConverter(temp);
      console.log(result);

      client.replyMessage({
        replyToken: replyToken,
        messages: [{ type: 'text', text: temp }],
      });

      this.log.recordLog({
        uid: '',
        userID: userID,
        prompt: textEventMessage.text,
        responseMessage: temp,
        hasError: false,
      });
    } catch (e) {
      console.log(e);

      client.replyMessage({
        replyToken: replyToken,
        messages: [
          { type: 'text', text: '戦士の登録がうまくされていない可能性があります。' },
          { type: 'text', text: temp },
        ],
      });
      this.log.recordLog({
        uid: '',
        userID: userID,
        prompt: textEventMessage.text,
        responseMessage: temp,
        hasError: true,
      });
    }

    return;
  }

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

  async replayImage(replyToken: string, textEventMessage: TextEventMessage): Promise<void> {
    console.log(textEventMessage);

    const client = this.env.createLinebotClient();
    client.replyMessage({
      replyToken: replyToken,
      messages: [
        {
          type: 'image',
          originalContentUrl: 'https://ryutest9da3.blob.core.windows.net/image/kinoko-origin.png',
          previewImageUrl: 'https://ryutest9da3.blob.core.windows.net/image/kinoko-preview.png',
        },
      ],
    });
    return;
  }
}
