import { Injectable } from '@nestjs/common';
import { MessageSendType } from '../conOnce.types.js';

@Injectable()
export class ChatService {
  async sendMessage(data: MessageSendType) {}
}
