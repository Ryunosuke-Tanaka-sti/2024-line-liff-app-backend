import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentsModule } from './config/enviroments.module';
import { LineBotModule } from './line-bot/line-bot.module';
import { LineBotService } from './line-bot/line-bot.service';
import { LineModule } from './line/line.module';
import { UserModule } from './user/user.module';
import { UtilitieDataModule } from './utilitie-data/utilitie-data.module';
import { TokenDecodeModule } from './utils/token-decode/token-decode.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [EnvironmentsModule, TokenDecodeModule, LineModule, LineBotModule, UtilitieDataModule, UserModule, SearchModule],
  controllers: [AppController],
  providers: [AppService, LineBotService],
})
export class AppModule {}
