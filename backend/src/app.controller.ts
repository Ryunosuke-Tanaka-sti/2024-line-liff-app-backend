import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { GoogleIdTokenVerifyGrantIdGuard } from './common/guard/google-id-token-verify-grant-id/google-id-token-verify-grant-id.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(GoogleIdTokenVerifyGrantIdGuard)
  async getHello(@Body() request: { uid: string }): Promise<string> {
    console.log(`request ${request.uid}`);
    return this.appService.getHello();
  }

  @Post()
  @UseGuards(GoogleIdTokenVerifyGrantIdGuard)
  async postHello(@Body() request: { uid: string }): Promise<string> {
    console.log(request.uid);
    return this.appService.getHello();
  }
}
