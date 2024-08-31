import { Global, Module } from '@nestjs/common';
import { AoaiPromptService } from './aoai-prompt.service';

@Global()
@Module({
  providers: [AoaiPromptService],
  exports: [AoaiPromptService],
})
export class AoaiPromptModule {}
