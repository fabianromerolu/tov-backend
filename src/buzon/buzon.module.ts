import { Module } from '@nestjs/common';
import { BuzonController } from './buzon.controller';
import { BuzonService } from './buzon.service';

@Module({
  controllers: [BuzonController],
  providers: [BuzonService],
})
export class BuzonModule {}
