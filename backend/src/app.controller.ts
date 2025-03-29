import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async getHello(@Body() request: { uid: string }): Promise<string> {
    console.log(`request ${request.uid}`);
    return this.appService.getHello();
  }

  @Post('/api')
  async postHello(@Body() req): Promise<{ roles: string[] }> {
    console.error(`request`, req);
    return { roles: ['admin'] };
  }
}
