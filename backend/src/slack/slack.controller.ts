import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SlackService } from './slack.service';
import { SlackBotSignatureGuard } from 'src/common/guard/slack-bot-signature/slack-bot-signature.guard';

import { SlackEvent } from '@slack/types';

@Controller('/api/slack/')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @UseGuards(SlackBotSignatureGuard)
  @Post('events')
  async handleSlackEvents(@Body() payload): Promise<string | { challenge: string }> {
    // SlackのイベントがURL検証リクエストの場合は、challengeを返す
    // これにより、Slackがイベントサブスクリプションを確認できるようになります
    if (payload.type === 'url_verification') {
      console.log('URL Verification Request handled.');
      return { challenge: payload.challenge };
    }
    const event: SlackEvent = payload.event;

    // イベントのタイプがサポートされていない場合はログを出力して終了
    // ここでは 'event_callback' タイプのみを処理する
    // 他のイベントタイプは無視する
    // 例えば、'url_verification' や 'app_mention' などはここでは処理しない
    // 必要に応じて他のイベントタイプを追加することができます
    if (payload.type !== 'event_callback' || !event) {
      console.log('Unsupported Slack event type:', payload.type);
      return 'OK'; // Slackに200 OKを返却
    }

    // イベントの処理を行う
    if (event.type === 'reaction_added') {
      // リアクションが 'notebooklm' の場合のみ処理を行う
      if (event.reaction == 'notebooklm') {
        this.slackService.updateDataSource(event);
      }
      return 'OK'; // Slackに200 OKを返却
    }

    return 'OK'; // Slackに200 OKを返却
  }
}
