import { IsLiffAuthenticatedGuard } from './is-liff-authenticated.guard';

describe('IsLiffAuthenticatedGuard', () => {
  it('should be defined', () => {
    expect(new IsLiffAuthenticatedGuard()).toBeDefined();
  });
});
