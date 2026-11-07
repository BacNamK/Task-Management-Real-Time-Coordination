import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { projectService } from './project.Service.js';
import { projectRepository } from './project.Repository.js';
import { CreateDto } from './project.Dto.js';
import { UserId } from '../../common/decorators/decorator-id.js';
import { NotificationGateway } from '../realtime/con1/notification/notification.gateway.js';
@Controller('/projects')
export class projectController {
  constructor(
    private readonly Service: projectService,
    private readonly Repository: projectRepository,
    private readonly Notification: NotificationGateway,
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
    @Query('projectUuid') projectId: string,
    @Query('userName') userName: string,
  ) {
    return this.Service.checkMember(projectId, userName);
  }

  @Post('/addMember')
  @HttpCode(HttpStatus.OK)
  async addMember(
    @Query('projectId') projectId: string,
    @Query('userId') userId: string,
    @UserId() actorId: string,
  ) {
    const data = await this.Service.addMember(projectId, userId, actorId);
    this.Notification.handleToEntity(userId, data.noti);
    return { success: true };
  }
}
