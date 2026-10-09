import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.Controller.js';
import { WorkspaceService } from './workspace.Service.js';
import { WorkspaceRp } from './workspace.Repository.js';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceRp],
})
export class WorkspaceModule {}
