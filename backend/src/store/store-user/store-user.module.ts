import { Global, Module } from '@nestjs/common';
import { StoreUserService } from './store-user.service';

@Global()
@Module({
  providers: [StoreUserService],
  exports: [StoreUserService],
})
export class StoreUserModule {}
