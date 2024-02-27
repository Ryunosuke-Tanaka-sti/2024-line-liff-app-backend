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
    const todos = await this.lineService.readTodo();
    console.log(todos);
    return;
  }
  @Get('todos')
  // @UseGuards(IsLiffAuthenticatedGuard)
  async readTodos(): Promise<void> {
    await this.lineService.updateTodo({
      uid: 'A06taCLxzsHHvy4g3Zdx',
      userID: 'user',
      text: 'user',
      done: true,
      timestamp: new Date(),
    });
    return;
  }

  @Post('todo')
  // @UseGuards(IsLiffAuthenticatedGuard)
  async test(@Body() request: RequestLineTodoPostDto): Promise<void> {
    console.log(request);

    // const userID = await this.tokenDecode.decodeUserID(request.idToekn);
    await this.lineService.createTodo({ userID: 'test', text: 'test', done: false });
    return;
  }
}
