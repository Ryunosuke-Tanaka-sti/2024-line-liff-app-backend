import { Test, TestingModule } from '@nestjs/testing';
import { DocsAccessService } from './docs-access.service';

describe('DocsAccessService', () => {
  let service: DocsAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocsAccessService],
    }).compile();

    service = module.get<DocsAccessService>(DocsAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
