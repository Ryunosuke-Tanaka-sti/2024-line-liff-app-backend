import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { IsLiffAuthenticatedGuard } from 'src/common/guard/is-liff-authenticated/is-liff-authenticated.guard';
import { RequestBattleDto, RequestUserIDDto } from './dto/request-line.dto';
import { ResponseReadUser, ResposeseOnlyEnemy } from './dto/response-line.dto';
import { LineService } from './line.service';

@Controller('api')
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Get('user')
  @UseGuards(IsLiffAuthenticatedGuard)
  async readUser(@Body() req: RequestUserIDDto): Promise<ResponseReadUser> {
    const userID = req.userID;
    const isExistUser = await this.lineService.isExistUser(userID);
    if (!isExistUser) {
      await this.lineService.createUser(userID);
      const readUser = await this.lineService.readUesr(userID);
      return readUser;
    }

    const readUser = await this.lineService.readUesr(userID);

    return readUser;
  }

  @Get('battle')
  @UseGuards(IsLiffAuthenticatedGuard)
  async battlePrompt(): Promise<ResposeseOnlyEnemy> {
    const enemy = await this.lineService.getRandamEnemy();
    return {
      enemyID: enemy.uid,
      name: enemy.name,
      imageUrl: enemy.originalContentUrl,
    };
  }

  @Post('battle')
  @UseGuards(IsLiffAuthenticatedGuard)
  async battle(@Body() req: RequestBattleDto) {
    const result = await this.lineService.battlePrompt(req.userID, req.enemyID, req.name, req.prompt);
    const winner = result.winner;
    await this.lineService.updateBattleResult(req.userID, winner);
    return result;
  }
}
