import { Test, TestingModule } from '@nestjs/testing';
import { TokenDecodeService } from './token-decode.service';

describe('TokenDecodeService', () => {
  let service: TokenDecodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenDecodeService],
    }).compile();

    service = module.get<TokenDecodeService>(TokenDecodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
