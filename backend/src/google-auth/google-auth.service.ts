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

  async verfyIdToken(idToken: string): Promise<any> {
    const client = this.env.GoogleOAuth2Client();
    console.log('idToken', idToken);
    try {
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: this.env.GoogleClientID,
      });
      const payload = ticket.getPayload();
      console.log('payload', payload);
      const now = Math.floor(Date.now() / 1000); // 現在時刻（秒単位）
      if (payload && payload.exp && payload.exp > now) {
        return true; // トークンは有効
      } else {
        return false; // トークンは無効または期限切れ
      }
    } catch (error) {
      console.error('Error verifying access token:', error);
      return false; // トークンが無効の場合
    }
  }

  async getToken(code: string): Promise<any> {
    const client = this.env.GoogleOAuth2Client();
    const tmp = await client.getToken(code);
    console.log(tmp);
    const { tokens } = tmp;
    return tokens;
  }
  // tokens: {
  //   access_token: '*************************************',
  //   refresh_token: '**************************************',
  //   scope: '',
  //   token_type: 'Bearer',
  //   id_token: '***************************************',
  //   expiry_date: 1743833416822
  // }

  async test(access_token: string): Promise<any> {
    const url = this.env.GoogleScriptURL;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: 'myFunction',
      }),
    });
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(`Error: ${data.error.message}`);
    }
    console.log('response', data.response);
    // response {
    //   '@type': 'type.googleapis.com/google.apps.script.v1.ExecutionResponse',
    //   result: 'Hello World!'
    // }
    console.log('response', data.response.result);
    return response;
  }
}
