import { Module } from '@nestjs/common';
import { AppCacheModule } from '../../../../lib/redis.module.js';
import { projectModule } from '../../../project/project.Module.js';
import { PresenceGateway } from './presence.gateway.js';
import { PresenceService } from './presence.service.js';

@Module({
  imports: [AppCacheModule, projectModule],
  providers: [PresenceGateway, PresenceService],
  exports: [PresenceService],
})
export class PresenceModule {}
