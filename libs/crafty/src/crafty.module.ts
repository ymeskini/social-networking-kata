import { Module } from '@nestjs/common';
import { CraftyService } from './crafty.service';

@Module({
  providers: [CraftyService],
  exports: [CraftyService],
})
export class CraftyModule {}
