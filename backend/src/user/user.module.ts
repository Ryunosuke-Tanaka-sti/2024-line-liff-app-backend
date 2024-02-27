import { Module } from '@nestjs/common';
import { UtilitieDataModule } from 'src/utilitie-data/utilitie-data.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [UtilitieDataModule],
})
export class UserModule {}
