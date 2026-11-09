import { Module } from '@nestjs/common';
import { NotificationController } from './notification.Controller.js';
import { NotificationRepository } from './notification.Repository.js';
import { NotificationService } from './notification.Service.js';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
})
export class NotificationsModule {}
