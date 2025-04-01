import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/api/assignRoles')
  async postHello(@Body() req: { userDetails: string }): Promise<{ roles: string[] }> {
    const roles = await this.appService.assignRoles(req.userDetails);
    return { roles: roles };
  }
}
