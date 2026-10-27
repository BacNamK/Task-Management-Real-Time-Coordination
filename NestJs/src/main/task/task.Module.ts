import { Module } from '@nestjs/common';
import { TaskController } from './task.Controller.js';
import { TaskRepository } from './task.Repository.js';
import { TaskService } from './task.Service.js';

@Module({
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
})
export class TaskModule {}
