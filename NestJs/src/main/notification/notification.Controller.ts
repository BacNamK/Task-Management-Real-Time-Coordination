import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserId } from '../../common/decorators/decorator-id.js';
import { NotificationService } from './notification.Service.js';
import { NotificationRepository } from './notification.Repository.js';
import { ok } from 'assert';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly service: NotificationService,
    private readonly repository: NotificationRepository,
  ) {}

  @Get()
  findForCurrentUser(@UserId() userId: string) {
    return this.service.findByRecipientId(userId);
  }

  @Post('/acceptinvite')
  async acceptAction(
    @UserId() userId: string,
    @Body() Body: { acctionId: string },
  ) {
    const result = await this.repository.acceptInviteProject(
      Body.acctionId,
      userId,
    );

    if (!result) return { success: false };

    return { data: result, success: true };
  }

  @Patch('/updatesatus')
  async updateStatus(@Body() body: string[]) {
    await this.service.updateStatus(body);
    return { success: true };
  }
}
