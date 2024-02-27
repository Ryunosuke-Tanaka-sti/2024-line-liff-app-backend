import { GoogleIdTokenVerifyGuard } from './google-id-token-verify.guard';

describe('GoogleIdTokenVerifyGuard', () => {
  it('should be defined', () => {
    expect(new GoogleIdTokenVerifyGuard()).toBeDefined();
  });
});
