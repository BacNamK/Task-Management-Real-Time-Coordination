import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WorkspaceService } from './workspace.Service.js';
import { WorkspaceRepository } from './workspace.Repository.js';

@Controller('/workspaces')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}

  @Get()
  getWorkspaces(@Query('u') userUuid: string) {
    return this.workspaceRepository.get(userUuid);
  }

  @Get('checkMember')
  checkMember(
    @Query('workspaceUuid') workspaceUuid: string,
    @Query('userName') userName: string,
  ) {
    return this.workspaceService.checkMember(workspaceUuid, userName);
  }

  @Post('create')
  createWorkspace(@Body() body: any) {
    return this.workspaceService.create(
      body.workspaceName,
      BigInt(body.userId),
    );
  }

  @Post('addMember')
  addMember(@Body() body: any) {
    return this.workspaceService.addMember(
      body.workspaceId,
      BigInt(body.userId),
    );
  }
}
