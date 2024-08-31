import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { EnvironmentsService } from 'src/config/enviroments.service';

import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class GoogleIdTokenVerifyGrantIdGuard implements CanActivate {
  constructor(private readonly env: EnvironmentsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const request = context.switchToHttp().getRequest();

    const decodeToken = await getAuth(this.env.firebaseAppInstance).verifyIdToken(
      request['headers']['google-certification'],
    );
    if (!decodeToken) return false;
    req.body.uid = decodeToken.uid;
    return true;
  }
}
