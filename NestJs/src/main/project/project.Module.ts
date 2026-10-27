import { Module } from '@nestjs/common';
import { projectController } from './project.Controller.js';
import { projectService } from './project.Service.js';
import { projectRepository } from './project.Repository.js';
import { UsersRepository } from '../users/users.Repository.js';

@Module({
  controllers: [projectController],
  providers: [projectService, projectRepository, UsersRepository],
})
export class projectModule {}
