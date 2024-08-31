import { Test, TestingModule } from '@nestjs/testing';
import { AoaiPromptService } from './aoai-prompt.service';

describe('AoaiPromptService', () => {
  let service: AoaiPromptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AoaiPromptService],
    }).compile();

    service = module.get<AoaiPromptService>(AoaiPromptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
