import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { IsLiffAuthenticatedGuard } from 'src/common/guard/is-liff-authenticated/is-liff-authenticated.guard';
import { TokenDecodeService } from 'src/utils/token-decode/token-decode.service';
import { RequestLineDto, RequestLineTodoPostDto } from './dto/request-line.dto';
import { LineService } from './line.service';

@Controller('line')
export class LineController {
  constructor(
    private readonly lineService: LineService,
    private readonly tokenDecode: TokenDecodeService,
  ) {}

  @Post('token')
  @UseGuards(IsLiffAuthenticatedGuard)
  async tokenVerify(@Body() request: RequestLineDto): Promise<string> {
    const userID = this.tokenDecode.decodeUserID(request.idToekn);
    return userID;
  }

  @Get('todo')
  // @UseGuards(IsLiffAuthenticatedGuard)
  async readTodo(): Promise<void> {
    await this.lineService.readTodo();
    return;
  }

  @Post('todo')
  // @UseGuards(IsLiffAuthenticatedGuard)
  async test(@Body() request: RequestLineTodoPostDto): Promise<void> {
    // const userID = await this.tokenDecode.decodeUserID(request.idToekn);
    console.log(request);
    await this.lineService.createTodo({ userID: 'test', text: 'test', done: false });
    return;
  }
}
