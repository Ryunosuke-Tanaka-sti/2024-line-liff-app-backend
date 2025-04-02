import { Injectable } from '@nestjs/common';
import { EnvironmentsService } from 'src/config/enviroments.service';

@Injectable()
export class GoogleAuthService {
  constructor(private readonly env: EnvironmentsService) {}

  async getGoogleAuthUrl(): Promise<string> {
    const client = this.env.GoogleOAuth2Client();

    const authUrl = client.generateAuthUrl({
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/script.scriptapp',
        'https://www.googleapis.com/auth/script.external_request',
      ],
      redirect_uri: this.env.GoogleRedirectUri,
    });
    return authUrl;
  }

  async getToken(code: string): Promise<any> {
    const client = this.env.GoogleOAuth2Client();
    const { tokens } = await client.getToken(code);
    return tokens;
  }
}
