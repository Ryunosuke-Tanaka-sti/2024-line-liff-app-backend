import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentsModule } from './config/enviroments.module';
import { LineBotModule } from './line-bot/line-bot.module';
import { LineModule } from './line/line.module';
import { LogModule } from './store/log/log.module';
import { StoreEnemyModule } from './store/store-enemy/store-enemy.module';
import { StoreUserModule } from './store/store-user/store-user.module';
import { AoaiPromptModule } from './utils/aoai-prompt/aoai-prompt.module';
import { TokenDecodeModule } from './utils/token-decode/token-decode.module';

@Module({
  imports: [
    EnvironmentsModule,
    TokenDecodeModule,
    LineModule,
    LineBotModule,
    AoaiPromptModule,
    LogModule,
    StoreUserModule,
    StoreEnemyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
