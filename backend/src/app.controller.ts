import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { IsGoogleAuthenticatedGuard } from './common/guard/is-google-authenticated/is-google-authenticated.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api/assignRoles')
  @UseGuards(IsGoogleAuthenticatedGuard)
  async getHello(
    @Body() req: { googleAccessToken: string; googleRefreshToken: string },
  ): Promise<{ googleAccessToken: string; googleRefreshToken: string }> {
    return { googleAccessToken: req.googleAccessToken, googleRefreshToken: req.googleRefreshToken };
    // return this.appService.getHello();
  }

  @Post('/api/assignRoles')
  async postHello(@Body() req: { userDetails: string }): Promise<{ roles: string[] }> {
    const roles = await this.appService.assignRoles(req.userDetails);
    return { roles: roles };
  }
}
