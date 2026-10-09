import { Module } from '@nestjs/common';
import { UsersController } from './user.Controller.js';
import { UsersService } from './users.Service.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
