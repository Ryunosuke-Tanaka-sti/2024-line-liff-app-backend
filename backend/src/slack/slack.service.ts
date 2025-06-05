import { Injectable } from '@nestjs/common';
import { ReactionAddedEvent, WebClient } from '@slack/web-api';
import { MessageElement } from '@slack/web-api/dist/types/response/ConversationsHistoryResponse';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { DocsAccessService } from 'src/utils/docs-access/docs-access.service';

@Injectable()
export class SlackService {
  private client: WebClient;
  constructor(
    private readonly env: EnvironmentsService,
    private readonly docService: DocsAccessService,
  ) {
    const token = this.env.SlackBotToken;
    this.client = new WebClient(token);
  }

  async updateDataSource(event: ReactionAddedEvent): Promise<void> {
    const channelId = event.item.channel;
    const ts = event.item.ts;
    const message = await this.getMessage(channelId, ts);
    if (!message) {
      console.warn(`Message not found for channel ${channelId} and ts ${ts}`);
    }

    if (message.text != '') {
      const docId = this.env.GoogleDocsID;
      const text = `\n---\n${message.text}\n---\n`;
      await this.docService.updateDoc(docId, text);

      this.postMessage(
        channelId,
        `Notebook LMデータソースに追記しました: ${event.reaction} by <@${event.user}>`,
        ts, // ここでスレッドのtsを指定
      );
    } else {
      this.postMessage(
        channelId,
        `現在テキストソースにしか対応していません。リアクションをつけたメッセージはテキストが空でした。`,
        ts, // ここでスレッドのtsを指定
      );
    }
  }

  async postMessage(channelId: string, text: string, threadTs?: string): Promise<void> {
    try {
      console.log(`Attempting to post message to channel ${channelId}${threadTs ? ` in thread ${threadTs}` : ''}`);
      await this.client.chat.postMessage({
        channel: channelId,
        text: text,
        thread_ts: threadTs, // ここに返信したいメッセージのtsを指定
        // optional: icon_emoji: ':robot_face:', // カスタムアイコンを使いたい場合
        // optional: username: 'My Reaction Bot', // カスタムユーザー名を使いたい場合
      });
      // console.log('Message posted successfully:', result.ts);
    } catch (error) {
      console.error(`Failed to post message: ${error.message}`, error.stack);
      if (error.data) {
        console.error('Slack API error response:', error.data);
      }
      throw error;
    }
  }
  async getMessage(channelId: string, ts: string): Promise<MessageElement | null> {
    try {
      // console.log(`Attempting to get message from channel ${channelId} with ts ${ts}`);
      const result = await this.client.conversations.history({
        channel: channelId,
        latest: ts,
        limit: 1,
        inclusive: true,
      });
      if (result.messages && result.messages.length > 0) {
        console.log('Message retrieved successfully:', result.messages[0]);
        return result.messages[0];
      } else {
        console.warn('No messages found for the given ts');
        return null;
      }
    } catch (error) {
      console.error(`Failed to get message: ${error.message}`, error.stack);
      if (error.data) {
        console.error('Slack API error response:', error.data);
      }
      throw error;
    }
  }
}
