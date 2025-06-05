import { EnvironmentsService } from 'src/config/enviroments.service';
import { SlackBotSignatureGuard } from './slack-bot-signature.guard';
import { Test, TestingModule } from '@nestjs/testing';

describe('SlackBotSignatureGuard', () => {
  let guard: SlackBotSignatureGuard;
  let envService: EnvironmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlackBotSignatureGuard, EnvironmentsService],
    }).compile();

    envService = module.get<EnvironmentsService>(EnvironmentsService);
    guard = new SlackBotSignatureGuard(envService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
