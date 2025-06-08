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
        'https://www.googleapis.com/auth/spreadsheets',
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

  // https://developers.google.com/apps-script/api/reference/rest/v1/scripts/run?hl=ja
  async runScript(
    accessToken: string,
    functionName: 'healthCheckFunction' | 'getSheetAllData' | 'insertDataToTargetSheet',
    parameters: (string | number)[] | undefined,
  ): Promise<string | undefined | { url: string; content: string }[]> {
    const url = this.env.GoogleScriptURL;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: functionName,
        parameters: parameters || [],
      }),
    });
    const data = await response.json();
    if (response.status !== 200 || data.error) {
      console.error('Error calling Google Apps Script:', data.error);
      throw new Error(`Error: ${data.error.message}`);
    }

    const result = data.response.result;

    if (typeof result === 'undefined') return;
    if (typeof result === 'string') return result;
    if (Array.isArray(result)) {
      const temp = result.map((item: { url: string; content: string }) => {
        return {
          url: item.url || '',
          content: item.content || '',
        };
      });
      return temp;
    }
    return result;
  }
}
