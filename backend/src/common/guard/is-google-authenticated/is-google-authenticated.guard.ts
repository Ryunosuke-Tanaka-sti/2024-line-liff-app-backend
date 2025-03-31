import { CanActivate, ExecutionContext, Injectable, RawBodyRequest } from '@nestjs/common';

@Injectable()
export class IsGoogleAuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const request = context.switchToHttp().getRequest<RawBodyRequest<Request>>();
    const tokens = this.extractTokenFromHeader(request);

    if (!tokens) return false;

    const { googleAccessToken, googleRefreshToken } = tokens;
    req.body.googleAccessToken = googleAccessToken;
    req.body.googleRefreshToken = googleRefreshToken;

    return true;
  }
  private extractTokenFromHeader(
    request: Request,
  ): { googleAccessToken: string; googleRefreshToken: string } | undefined {
    const googleAccessToken = request.headers['X-MS-TOKEN-GOOGLE-ACCESS-TOKEN'];
    const googleRefreshToken = request.headers['X-MS-TOKEN-GOOGLE-REFRESH-TOKEN'];
    if (!googleAccessToken || !googleRefreshToken) return undefined;
    return { googleAccessToken: googleAccessToken, googleRefreshToken: googleRefreshToken };
  }
}
