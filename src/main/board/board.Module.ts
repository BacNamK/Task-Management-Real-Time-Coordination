import { Module } from '@nestjs/common';
import { BoardRepository } from './board.Repository.js';
import { BoardController } from './board.Controller.js';
import { BoardService } from './board.Service.js';
import { CycleRepository } from '../cycle/cycle.Repository.js';
import { projectRepository } from '../project/project.Repository.js';
import { UsersRepository } from '../users/users.Repository.js';

@Module({
  controllers: [BoardController],
  providers: [
    BoardService,
    BoardRepository,
    CycleRepository,
    projectRepository,
    UsersRepository,
  ],
})
export class BoardModule {}
