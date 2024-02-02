import { WebhookEvent, WebhookRequestBody } from '@line/bot-sdk';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LineBotSignatureGuard } from 'src/common/guard/line-bot-signature/line-bot-signature.guard';
import { LineBotService } from './line-bot.service';

@Controller('line-bot')
export class LineBotController {
  constructor(private readonly botService: LineBotService) {}

  @Post()
  @UseGuards(LineBotSignatureGuard)
  async getHello(@Body() req: WebhookRequestBody): Promise<string> {
    const events: WebhookEvent[] = req.events;
    if (events.length === 0) return;

    const event = events[0];
    if (event.type !== 'message' || event.message.type !== 'text') {
      return;
    }
    this.botService.replyParrot(event.replyToken, event.message);

    return;
  }
}
