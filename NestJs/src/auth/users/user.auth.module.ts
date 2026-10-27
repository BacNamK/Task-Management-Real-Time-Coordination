import { Module } from '@nestjs/common';
import { UsersRepository } from '../../main/users/users.Repository.js';
import { UsersAuthController } from './users.auth.controller.js';

@Module({
  controllers: [UsersAuthController],
  providers: [UsersRepository],
})
export class UsersAuthModule {}
