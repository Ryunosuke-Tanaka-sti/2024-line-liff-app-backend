import { Injectable } from '@nestjs/common';
import { ReactionAddedEvent, WebClient } from '@slack/web-api';
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

    if (message != '') {
      const docId = this.env.GoogleDocsID;
      const text = `\n---\n${message}\n---\n`;
      await this.docService.updateDoc(docId, text);

      this.postMessage(
        channelId,
        `Notebook LMデータソースに追記しました: ${event.reaction} by <@${event.user}> \n\n${message}`,
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
  // あなただけに表示されています系メッセージ
  async postMessageEphemeral(channelId: string, text: string, threadTs: string, user: string): Promise<void> {
    try {
      console.log(`Attempting to post message to channel ${channelId}${threadTs ? ` in thread ${threadTs}` : ''}`);
      await this.client.chat.postEphemeral({
        channel: channelId,
        user: user,
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
  async getBotId(): Promise<string> {
    try {
      console.log('Attempting to get bot ID');
      const authResponse = await this.client.auth.test();
      console.log('Bot ID retrieved successfully:', authResponse.user_id);
      return authResponse.user_id;
    } catch (error) {
      console.error(`Failed to get bot ID: ${error.message}`, error.stack);
      if (error.data) {
        console.error('Slack API error response:', error.data);
      }
      throw error;
    }
  }

  async getMessage(channelId: string, ts: string): Promise<string> {
    try {
      console.log(`Attempting to get message from channel ${channelId} with ts ${ts}`);
      const result = await this.client.conversations.history({
        channel: channelId,
        latest: ts,
        limit: 1,
        inclusive: true,
      });
      if (result.messages && result.messages.length > 0) {
        const message = result.messages[0];

        if (message.thread_ts) {
          const repilesResponse = await this.client.conversations.replies({
            channel: channelId,
            ts: message.thread_ts,
          });

          const replies = repilesResponse.messages
            .map((reply) => {
              // TODO：BOTが返信したメッセージを除外する
              if (reply.bot_id) return '';
              return reply.text ? reply.text : '';
            })
            .join('\n');

          console.log('Replies retrieved successfully:', replies);
          return replies;
        }
        return message.text ? message.text : '';
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
