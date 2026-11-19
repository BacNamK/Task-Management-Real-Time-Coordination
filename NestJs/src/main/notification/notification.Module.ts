import { Module } from '@nestjs/common';
import { NotificationController } from './notification.Controller.js';
import { NotificationRepository } from './notification.Repository.js';
import { NotificationService } from './notification.Service.js';
import { notificationModule } from '../realtime/con1/notification/noitification.module.js';

@Module({
  controllers: [NotificationController],
  imports: [notificationModule],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService],
})
export class NotificationsModule {}
