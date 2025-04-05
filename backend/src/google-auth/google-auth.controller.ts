import { Controller, Get, Res, Req, Query } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';

@Controller('/api/google-auth/')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  // Google認証のURLを取得する
  @Get()
  async getGoogleAuthUrl(@Res() res): Promise<string> {
    const authUrl = await this.googleAuthService.getGoogleAuthUrl();
    return res.redirect(authUrl);
  }

  // Google認証のコールバックURL
  @Get('callback')
  async getGoogleAuthCallback(@Query('code') code: string, @Res() res): Promise<void> {
    const tokens = await this.googleAuthService.getToken(code);

    res.cookie('id_token', tokens.id_token, {
      httpOnly: false,
      secure: false,
      sameSite: 'Strict',
      maxAge: 3600 * 1000, // 1時間
    });

    res.cookie('access_token', tokens.access_token, {
      httpOnly: false,
      secure: false,
      sameSite: 'Strict',
      maxAge: 3600 * 1000, // 1時間
    });

    res.redirect('/google');
  }

  // Google認証のトークンを検証する
  @Get('verify')
  async verifyIdToken(@Req() req, @Res() res): Promise<void> {
    const idToken = req.cookies['id_token'];
    if (!idToken) res.redirect('/api/google-auth');

    const isValid = await this.googleAuthService.verfyIdToken(idToken);

    if (isValid) {
      res.status(200).json({ message: 'Valid access token' });
    } else {
      res.redirect('/api/google-auth');
    }
  }

  @Get('test')
  async test(@Req() req, @Res() res): Promise<void> {
    const access_token = req.cookies['access_token'];
    console.log('access_token', access_token);
    await this.googleAuthService.test(access_token);

    return res.status(200).json({ message: 'test' });
  }
}
