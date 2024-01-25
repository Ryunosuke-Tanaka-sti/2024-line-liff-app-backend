import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentsModule } from './config/enviroments.module';
import { LineModule } from './line/line.module';
import { TokenDecodeModule } from './utils/token-decode/token-decode.module';
import { LineBotService } from './line-bot/line-bot.service';
import { LineBotModule } from './line-bot/line-bot.module';

@Module({
  imports: [EnvironmentsModule, TokenDecodeModule, LineModule, LineBotModule],
  controllers: [AppController],
  providers: [AppService, LineBotService],
})
export class AppModule {}
