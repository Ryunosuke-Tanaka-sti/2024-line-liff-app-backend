import { EnvironmentsService } from 'src/config/enviroments.service';
import { LineBotSignatureGuard } from './line-bot-signature.guard';

import { Test, TestingModule } from '@nestjs/testing';

describe('LineBotSignatureGuard', () => {
  let guard: LineBotSignatureGuard;
  let envService: EnvironmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LineBotSignatureGuard, EnvironmentsService],
    }).compile();

    envService = module.get<EnvironmentsService>(EnvironmentsService);
    guard = new LineBotSignatureGuard(envService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
