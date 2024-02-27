import { Module } from '@nestjs/common';
import { UtilitieDataController } from './utilitie-data.controller';
import { UtilitieDataService } from './utilitie-data.service';

@Module({
  controllers: [UtilitieDataController],
  providers: [UtilitieDataService],
  exports: [UtilitieDataService],
})
export class UtilitieDataModule {}
