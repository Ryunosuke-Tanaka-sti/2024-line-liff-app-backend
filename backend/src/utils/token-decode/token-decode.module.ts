import { Global, Module } from '@nestjs/common';
import { TokenDecodeService } from './token-decode.service';

@Global()
@Module({
  providers: [TokenDecodeService],
  exports: [TokenDecodeService],
})
export class TokenDecodeModule {}
