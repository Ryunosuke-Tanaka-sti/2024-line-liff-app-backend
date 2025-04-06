import { IsGoogleIdTokenVerifyGuard } from './is-google-id-token-verify.guard';

describe('IsGoogleIdTokenVerifyGuard', () => {
  it('should be defined', () => {
    expect(new IsGoogleIdTokenVerifyGuard()).toBeDefined();
  });
});
