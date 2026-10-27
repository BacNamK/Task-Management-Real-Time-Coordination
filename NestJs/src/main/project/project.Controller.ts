import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { projectService } from './project.Service.js';
import { projectRepository } from './project.Repository.js';
import { CreateDto } from './project.Dto.js';
import { UserId } from '../../common/decorators/decorator-id.js';
@Controller('/projects')
export class projectController {
  constructor(
    private readonly Service: projectService,
    private readonly Repository: projectRepository,
  ) {}

  @Post('/create')
  create(@Body() body: CreateDto, @UserId() userId: string) {
    return this.Service.create(body.projectName, userId);
  }

  @Get()
  gets(@UserId() userId: string) {
    return this.Service.gets(userId);
  }

  @Get('/target')
  targetUuid(@Query('uuid') uuid: string) {
    return this.Service.target(uuid);
  }

  @Get('/checkMember')
  checkMember(
    @Query('projectUuid') projectUuid: string,
    @Query('userName') userName: string,
  ) {
    return this.Service.checkMember(projectUuid, userName);
  }

  @Post('/addMember')
  addMember(
    @Query('projectId') projectId: string,
    @Query('userName') userName: string,
  ) {
    return this.Service.addMember(BigInt(projectId), userName);
  }
}
