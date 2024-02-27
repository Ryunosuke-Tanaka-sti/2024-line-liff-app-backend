import { Test, TestingModule } from '@nestjs/testing';
import { UtilitieDataService } from './utilitie-data.service';

describe('UtilitieDataService', () => {
  let service: UtilitieDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilitieDataService],
    }).compile();

    service = module.get<UtilitieDataService>(UtilitieDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
