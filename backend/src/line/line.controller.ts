import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { IsLiffAuthenticatedGuard } from 'src/common/guard/is-liff-authenticated/is-liff-authenticated.guard';
import { TokenDecodeService } from 'src/utils/token-decode/token-decode.service';
import { RequestLineDto } from './dto/request-line.dto';
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
    const userID = this.tokenDecode.decodeIdToken(request.idToekn);
    return userID;
  }
}
