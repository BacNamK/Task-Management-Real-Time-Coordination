import { Module } from '@nestjs/common';
import { ChatRepository } from './chat.repository.js';
import { ChatService } from './chat.service.js';
import { UsersRepository } from '../../../users/users.Repository.js';

@Module({
  providers: [ChatRepository, ChatService, UsersRepository],
  exports: [ChatService],
})
export class ChatModule {}
