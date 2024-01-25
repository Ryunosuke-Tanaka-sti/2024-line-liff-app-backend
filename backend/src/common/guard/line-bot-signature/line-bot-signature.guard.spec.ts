import { LineBotSignatureGuard } from './line-bot-signature.guard';

describe('LineBotSignatureGuard', () => {
  it('should be defined', () => {
    expect(new LineBotSignatureGuard()).toBeDefined();
  });
});
