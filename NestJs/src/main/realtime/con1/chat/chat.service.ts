import { Injectable } from '@nestjs/common';
import { MessageEmit, MessageSendType } from '../conOnce.types.js';
import { UsersRepository } from '../../../users/users.Repository.js';

@Injectable()
export class ChatService {
  constructor(private readonly UserRepository: UsersRepository) {}
  async sendMessage(data: MessageSendType) {
    const senderProflie = await this.UserRepository.findById(data.senderId);
    if (!senderProflie) return;
    const emittedMessage: MessageEmit = {
      ...data,
      sender: senderProflie,
      createAt: new Date().toISOString(),
    };

    return emittedMessage;
  }
}
