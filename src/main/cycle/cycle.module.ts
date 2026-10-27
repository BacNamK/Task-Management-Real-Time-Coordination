import { Module } from '@nestjs/common';
import { CycleRepository } from './cycle.Repository.js';
import { CycleController } from './cycle.Controller.js';
import { CycleService } from './cycle.Service.js';

@Module({
  controllers: [CycleController],
  providers: [CycleService, CycleRepository],
})
export class CycleModule {}
