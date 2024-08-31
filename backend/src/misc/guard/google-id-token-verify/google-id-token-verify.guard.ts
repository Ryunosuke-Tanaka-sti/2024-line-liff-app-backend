import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { getAuth } from 'firebase-admin/auth';
import { EnvironmentsService } from 'src/config/enviroments.service';

@Injectable()
export class GoogleIdTokenVerifyGuard implements CanActivate {
  constructor(private readonly env: EnvironmentsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const decodeToken = await getAuth(this.env.firebaseAppInstance).verifyIdToken(
        request['headers']['google-certification'],
      );
      if (!decodeToken) throw new UnauthorizedException();
      return true;
    } catch (e) {
      // Google Certification is not valid
      throw new UnauthorizedException();
    }
  }
}
