import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/api/assignRoles')
  async postHello(@Body() req: { userDetails: string }): Promise<{ roles: string[] }> {
    const roles = await this.appService.assignRoles(req.userDetails);
    return { roles: roles };
  }
  @Get('/api/hello')
  async getHello(): Promise<string> {
    const hello = await this.appService.getHello();
    return hello;
  }
}
