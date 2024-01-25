import { Module } from '@nestjs/common';
import { LineController } from './line.controller';
import { LineService } from './line.service';

@Module({
  providers: [LineService],
  controllers: [LineController],
})
export class LineModule {}
