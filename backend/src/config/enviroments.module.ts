import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentsService } from './enviroments.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ envFilePath: ['.env', '.env.local'] })],
  providers: [EnvironmentsService],
  exports: [EnvironmentsService],
})
export class EnvironmentsModule {}
