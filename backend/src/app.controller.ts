import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api')
  async getHello(): Promise<string> {
    console.log(`request`);
    return 'come on';
    // return this.appService.getHello();
  }

  @Post('/api')
  async postHello(@Body() req: { userDetails: string }): Promise<{ roles: string[] }> {
    console.error(`request`, req);
    if (req.userDetails === 'ry-tanaka@sios.com') {
      return { roles: ['admin', 'user'] };
    }
    return { roles: [] };
  }
}
