import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { projectService } from './project.Service.js';
import { CreateDto } from './project.Dto.js';
import { UserId } from '../../common/decorators/decorator-id.js';
import { NotificationGateway } from '../realtime/con1/notification/notification.gateway.js';
@Controller('/projects')
export class projectController {
  constructor(
    private readonly Service: projectService,
    private readonly Notification: NotificationGateway,
  ) {}

  @Post('/create')
  async create(@Body() body: CreateDto, @UserId() userId: string) {
    return await this.Service.create(body.projectName, userId);
  }

  @Get()
  async gets(@UserId() userId: string) {
    return await this.Service.gets(userId);
  }

  @Get('/target')
  async targetUuid(@Query('uuid') uuid: string) {
    return await this.Service.target(uuid);
  }

  @Get('/checkMember')
  async checkMember(
    @Query('projectUuid') projectUuid: string,
    @Query('userName') userName: string,
  ) {
    return await this.Service.checkMember(projectUuid, userName);
  }

  @Post('/addMember')
  @HttpCode(HttpStatus.OK)
  async addMember(
    @Query('projectUuid') projectUuid: string,
    @Query('userId') userId: string,
    @UserId() actorId: string,
  ) {
    const data = await this.Service.addMember(projectUuid, userId, actorId);
    this.Notification.handleToEntity(userId, data.noti);
    return { success: true };
  }

  @Get('/:uuid/preview')
  @HttpCode(HttpStatus.NOT_FOUND)
  async preview(@UserId() userId: string, @Param('uuid') uuid: string) {
    const result = await this.Service.verify(userId, uuid);

    if (!result) return { success: false };

    return result;
  }
}
