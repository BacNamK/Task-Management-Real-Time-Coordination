import { Module } from '@nestjs/common';
import { ChatRepository } from './chat.repository.js';
import { ChatService } from './chat.service.js';

@Module({
  providers: [ChatRepository, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
