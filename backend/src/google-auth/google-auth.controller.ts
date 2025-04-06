import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { IsGoogleIdTokenVerifyGuard } from 'src/common/guard/is-google-id-token-verify/is-google-id-token-verify.guard';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { GoogleAuthService } from './google-auth.service';

@Controller('/api/google-auth/')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly env: EnvironmentsService,
  ) {}

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
      httpOnly: this.env.isProduction,
      secure: this.env.isProduction,
      sameSite: 'Strict',
      maxAge: 3600 * 1000, // 1時間
    });

    // 環境によってbooleanを切り替える
    res.cookie('access_token', tokens.access_token, {
      httpOnly: this.env.isProduction,
      secure: this.env.isProduction,
      sameSite: 'Strict',
      maxAge: 3600 * 1000, // 1時間
    });

    res.redirect('/community/google/');
  }

  // Google認証のトークンを検証する
  @Get('verify')
  async verifyIdToken(@Req() req, @Res() res): Promise<void> {
    const idToken = req.cookies['id_token'];

    if (!idToken) {
      const authUrl = await this.googleAuthService.getGoogleAuthUrl();
      res.status(401).json({ message: 'No id_token', url: authUrl });
    }

    // token validation
    const isValid = await this.googleAuthService.verfyIdToken(idToken);

    if (isValid) {
      res.status(200).json({ message: 'Valid access token' });
    } else {
      const authUrl = await this.googleAuthService.getGoogleAuthUrl();
      res.status(401).json({ message: 'No id_token', url: authUrl });
    }
  }

  @Get('test')
  @UseGuards(IsGoogleIdTokenVerifyGuard)
  async test(@Req() req, @Res() res): Promise<void> {
    const access_token = req.cookies['access_token'];
    console.log('access_token', access_token);
    await this.googleAuthService.test(access_token);

    return res.status(200).json({ message: 'test' });
  }
}
