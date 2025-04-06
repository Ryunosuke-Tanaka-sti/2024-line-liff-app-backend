import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { Request } from 'express';

@Injectable()
export class IsGoogleIdTokenVerifyGuard implements CanActivate {
  constructor(private readonly env: EnvironmentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const idToken = request.cookies['id_token'];

    console.log('verify idToken', ':come on');

    if (!idToken) return false;
    const isValid = await this.verfyIdToken(idToken);
    if (!isValid) return false;
    return true;
  }

  private async verfyIdToken(idToken: string): Promise<any> {
    const client = this.env.GoogleOAuth2Client();
    try {
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: this.env.GoogleClientID,
      });
      const payload = ticket.getPayload();
      const now = Math.floor(Date.now() / 1000); // 現在時刻（秒単位）
      if (payload && payload.exp && payload.exp > now) {
        return true; // トークンは有効
      } else {
        return false; // トークンは無効または期限切れ
      }
    } catch (error) {
      return false; // トークンが無効の場合
    }
  }
}
