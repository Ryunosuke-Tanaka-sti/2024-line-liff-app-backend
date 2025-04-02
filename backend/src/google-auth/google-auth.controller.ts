import { Controller, Get, Res, Query } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';

@Controller('/api/google-auth/')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}
  @Get()
  async getGoogleAuthUrl(@Res() res): Promise<string> {
    const authUrl = await this.googleAuthService.getGoogleAuthUrl();
    return res.redirect(authUrl);
  }

  @Get('callback')
  async getGoogleAuthCallback(@Query('code') code: string, @Res() res): Promise<void> {
    const tokens = await this.googleAuthService.getToken(code);

    res.cookie('access_token', tokens.access_token, {
      httpOnly: false,
      secure: false,
      sameSite: 'Strict',
      maxAge: 3600 * 500, // 0.5時間
    });

    res.redirect('/google');
  }
}
