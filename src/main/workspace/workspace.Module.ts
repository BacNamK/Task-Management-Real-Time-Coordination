import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.Controller.js';
import { WorkspaceService } from './workspace.Service.js';
import { WorkspaceRepository } from './workspace.Repository.js';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceRepository],
})
export class WorkspaceModule {}
