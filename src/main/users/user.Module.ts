import { Module } from '@nestjs/common';
import { UsersController } from './user.Controller.js';
import { UsersService } from './users.Service.js';
import { UsersRepository } from './users.Repository.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
