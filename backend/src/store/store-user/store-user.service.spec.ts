import { Test, TestingModule } from '@nestjs/testing';
import { StoreUserService } from './store-user.service';

describe('StoreUserService', () => {
  let service: StoreUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreUserService],
    }).compile();

    service = module.get<StoreUserService>(StoreUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
