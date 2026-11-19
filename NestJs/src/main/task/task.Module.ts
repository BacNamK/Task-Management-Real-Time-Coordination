import { Module } from '@nestjs/common';
import { TaskController } from './task.Controller.js';
import { TaskRepository } from './task.Repository.js';
import { TaskService } from './task.Service.js';
import { NotificationsModule } from '../notification/notification.Module.js';

@Module({
  imports: [NotificationsModule],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
})
export class TaskModule {}
