import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserId } from '../../common/decorators/decorator-id.js';
import { NotificationService } from './notification.Service.js';
import { NotificationRepository } from './notification.Repository.js';

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
}
