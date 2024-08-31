import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async getHello(@Body() request: { uid: string }): Promise<string> {
    console.log(`request ${request.uid}`);
    return this.appService.getHello();
  }

  @Get('/api')
  async postHello(@Body() request: { uid: string }): Promise<string> {
    console.log(`request ${request.uid}`);
    return this.appService.getHello();
  }
}
