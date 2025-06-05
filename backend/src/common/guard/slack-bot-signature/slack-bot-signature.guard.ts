import { CanActivate, ExecutionContext, Injectable, RawBodyRequest, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { Observable } from 'rxjs';
import { EnvironmentsService } from 'src/config/enviroments.service';

@Injectable()
export class SlackBotSignatureGuard implements CanActivate {
  constructor(private readonly env: EnvironmentsService) {}
  private readonly MAX_TIMESTAMP_AGE_SECONDS = 300; // 5分 (リプレイアタック防止のため)

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<RawBodyRequest<Request>>();

    const slackSignature = request.headers['x-slack-signature'] as string;
    const slackTimestamp = request.headers['x-slack-request-timestamp'] as string;
    const rawBody = (request as any).rawBody; // main.ts で bodyParser を設定して取得

    if (!slackSignature || !slackTimestamp || !rawBody) {
      console.error('署名検証が失敗しました: 必要なヘッダーまたはボディが不足しています。');
      throw new UnauthorizedException('署名検証が失敗しました: 必要なヘッダーまたはボディが不足しています。');
    }

    // リプレイアタック
    const timestamp = parseInt(slackTimestamp, 10);
    const currentTime = Math.floor(Date.now() / 1000); // Unixタイムスタンプ (秒)

    if (Math.abs(currentTime - timestamp) > this.MAX_TIMESTAMP_AGE_SECONDS) {
      console.warn(
        // 日本語にしてエラーメッセージをわかりやすくする
        `Slackリクエストのタイムスタンプが古すぎるか、未来のものです。タイムスタンプ: ${timestamp}, 現在: ${currentTime}`,
      );
      throw new UnauthorizedException('Slackリクエストのタイムスタンプが古すぎるか、未来のものです。');
    }

    // Slackの署名検証
    const baseString = `v0:${timestamp}:${rawBody.toString()}`;

    const hmac = createHmac('sha256', this.env.SlackBotSigningSecret);
    hmac.update(baseString);
    const computedSignature = `v0=${hmac.digest('hex')}`;

    if (!timingSafeEqual(Buffer.from(computedSignature), Buffer.from(slackSignature))) {
      console.warn('Slackの署名が無効です。');
      throw new UnauthorizedException('Slackの署名が無効です。');
    }

    return true;
  }
}
