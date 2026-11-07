import { Module } from '@nestjs/common';
import { projectController } from './project.Controller.js';
import { projectService } from './project.Service.js';
import { projectRepository } from './project.Repository.js';
import { UsersRepository } from '../users/users.Repository.js';
import { ChatRepository } from '../realtime/con1/chat/chat.repository.js';
import { notificationModule } from '../realtime/con1/notification/noitification.module.js';

@Module({
  controllers: [projectController],
  providers: [
    projectService,
    projectRepository,
    UsersRepository,
    ChatRepository,
  ],
  imports: [notificationModule],
  exports: [projectRepository],
})
export class projectModule {}
