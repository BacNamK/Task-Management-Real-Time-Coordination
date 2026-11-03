import { Inject, Injectable } from '@nestjs/common';
import { MessageEmit, MessageSendType } from '../conOnce.types.js';
import { UsersRepository } from '../../../users/users.Repository.js';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ChatRepository } from './chat.repository.js';

@Injectable()
export class ChatService {
  constructor(
    private readonly UserRepository: UsersRepository,
    private readonly ChatRepository: ChatRepository,
    @Inject(CACHE_MANAGER) private readonly CacheManage: Cache,
  ) {}
  async sendMessage(data: MessageSendType) {
    let user = (await this.CacheManage.get<{
      name: string;
      avatar: string | null;
    } | null>(`user-profile:${data.senderId}`)) ?? null;

    if (!user) {
      const senderProflie = await this.UserRepository.findById(data.senderId);
      await this.CacheManage.set(
        `user-profile:${data.senderId}`,
        senderProflie,
      );

      user = senderProflie;
    }

    if (!user) return;
    const savedMessage = await this.ChatRepository.saveMessage(data);
    const emittedMessage: MessageEmit = {
      ...data,
      id: savedMessage.id,
      deleted: false,
      sender: {
        id: data.senderId,
        name: user.name,
        avatar: user.avatar,
      },
      replyTo: savedMessage.replyTo,
      createAt: savedMessage.createdAt.toISOString(),
    };

    return emittedMessage;
  }

  async loadMessages(roomUuid: string, userId: string) {
    return this.ChatRepository.loadMessages(roomUuid, userId);
  }

  async deleteMessage(messageId: string, roomUuid: string, senderId: string) {
    await this.ChatRepository.deleteMessage(messageId, roomUuid, senderId);
    return { messageId, roomUuid };
  }
}
