import { Module } from '@nestjs/common';
import { UtilitieDataModule } from 'src/utilitie-data/utilitie-data.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [UtilitieDataModule],
})
export class SearchModule {}
