import { Global, Module } from '@nestjs/common';
import { DocsAccessService } from './docs-access.service';

@Global()
@Module({
  providers: [DocsAccessService],
  exports: [DocsAccessService],
})
export class DocsAccessModule {}
