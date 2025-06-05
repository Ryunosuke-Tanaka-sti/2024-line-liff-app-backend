import { Injectable } from '@nestjs/common';

import { EnvironmentsService } from './config/enviroments.service';
import { DocsAccessService } from './utils/docs-access/docs-access.service';
@Injectable()
export class AppService {
  constructor(
    private readonly env: EnvironmentsService,
    private readonly service: DocsAccessService,
  ) {}
  async getHello(): Promise<string> {
    return `Hello World!!!!!!`;
  }

  async assignRoles(email: string): Promise<string[]> {
    const adminList = this.env.AdminEmailList;
    const isAdmin = adminList.includes(email);
    if (isAdmin) {
      return ['admin', 'user'];
    }
    return ['user'];
  }
}
