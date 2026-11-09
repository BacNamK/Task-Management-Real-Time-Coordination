import { Controller, Get } from '@nestjs/common';
import { UserId } from '../../common/decorators/decorator-id.js';
import { NotificationService } from './notification.Service.js';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Get()
  findForCurrentUser(@UserId() userId: string) {
    return this.service.findByRecipientId(userId);
  }
}
