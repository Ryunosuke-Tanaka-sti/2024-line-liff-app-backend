import { IsGoogleAuthenticatedGuard } from './is-google-authenticated.guard';

describe('IsGoogleAuthenticatedGuard', () => {
  it('should be defined', () => {
    expect(new IsGoogleAuthenticatedGuard()).toBeDefined();
  });
});
