import { Global, Module } from '@nestjs/common';
import { StoreEnemyService } from './store-enemy.service';

@Global()
@Module({
  providers: [StoreEnemyService],
  exports: [StoreEnemyService],
})
export class StoreEnemyModule {}
