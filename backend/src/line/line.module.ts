import { Module } from '@nestjs/common';
import { LineService } from './line.service';
import { LineController } from './line.controller';

@Module({
  providers: [LineService],
  controllers: [LineController]
})
export class LineModule {}
