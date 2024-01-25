import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentsModule } from './config/enviroments.module';
import { TokenDecodeModule } from './utils/token-decode/token-decode.module';
import { LineModule } from './line/line.module';

@Module({
  imports: [EnvironmentsModule, TokenDecodeModule, LineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
