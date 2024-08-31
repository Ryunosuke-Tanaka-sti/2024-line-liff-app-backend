import { CanActivate, ExecutionContext, Injectable, RawBodyRequest } from '@nestjs/common';

@Injectable()
export class IsLiffAuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const request = context.switchToHttp().getRequest<RawBodyRequest<Request>>();
    const token = this.extractTokenFromHeader(request);
    if (!token) return false;

    const accessTokenVerifyResponse = await fetch(`https://api.line.me/oauth2/v2.1/verify?access_token=${token}`);
    if (!accessTokenVerifyResponse.ok) return false;
    const response = await fetch('https://api.line.me/oauth2/v2.1/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userInfo = await response.json();
    req.body.userID = userInfo.sub;
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    if (!request.headers['authorization']) return undefined;
    const [type, token] = request.headers['authorization'].split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
