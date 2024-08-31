import { Test, TestingModule } from '@nestjs/testing';
import { StoreEnemyService } from './store-enemy.service';

describe('StoreEnemyService', () => {
  let service: StoreEnemyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreEnemyService],
    }).compile();

    service = module.get<StoreEnemyService>(StoreEnemyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
