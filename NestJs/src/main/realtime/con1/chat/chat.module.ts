import { Module } from '@nestjs/common';
import { ChatRepository } from './chat.repository.js';
import { ChatService } from './chat.service.js';
import { UsersRepository } from '../../../users/users.Repository.js';
import { AppCacheModule } from '../../../../lib/redis.module.js';
import { ChatGateway } from './chat.gateway.js';

@Module({
  imports: [AppCacheModule],
  providers: [ChatGateway, ChatRepository, ChatService, UsersRepository],
  exports: [ChatService],
})
export class ChatModule {}
