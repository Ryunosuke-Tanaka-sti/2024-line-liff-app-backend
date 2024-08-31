import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { GoogleIdTokenVerifyGrantIdGuard } from './google-id-token-verify-grant-id.guard';

describe('GoogleIdTokenVerifyGuard', () => {
  it('should be defined', () => {
    let service: EnvironmentsService;
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [EnvironmentsService],
      }).compile();
      service = module.get<EnvironmentsService>(EnvironmentsService);
    }),
      expect(new GoogleIdTokenVerifyGrantIdGuard(service)).toBeDefined();
  });
});
