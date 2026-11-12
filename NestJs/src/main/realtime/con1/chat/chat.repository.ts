import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from '../../../../lib/prisma.Client.js';
import type { MessageEmit, MessageSendType } from '../conOnce.types.js';

@Injectable()
export class ChatRepository {
  async createRoom(project_Id: bigint) {
    await prisma.chatRoom.create({
      data: { name: 'Lobby', projectId: project_Id, isDirect: false },
    });
    await prisma.chatRoom.create({
      data: { name: 'Voice', projectId: project_Id, isDirect: true },
    });
  }
  async saveMessage(data: MessageSendType) {
    const room = await prisma.chatRoom.findUnique({
      where: { uuid: data.roomUuid },
      select: { id: true },
    });

    if (!room) {
      throw new NotFoundException(`Chat room ${data.roomUuid} was not found`);
    }

    if (data.replyToId) {
      const replyTarget = await prisma.message.findFirst({
        where: {
          id: data.replyToId,
          roomId: room.id,
          isDelete: false,
        },
        select: { id: true },
      });

      if (!replyTarget) {
        throw new NotFoundException('Reply target was not found in this room');
      }
    }

    return prisma.message.create({
      data: {
        content: data.content,
        senderId: BigInt(data.senderId),
        roomId: room.id,
        replyToId: data.replyToId ?? null,
      },
      select: {
        id: true,
        createdAt: true,
        replyTo: {
          select: { id: true, content: true },
        },
      },
    });
  }

  async loadMessages(roomUuid: string, userId: string): Promise<MessageEmit[]> {
    const room = await prisma.chatRoom.findUnique({
      where: { uuid: roomUuid },
      select: { id: true, projectId: true },
    });

    if (!room) {
      throw new NotFoundException(`Chat room ${roomUuid} was not found`);
    }

    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: room.projectId,
          userId: BigInt(userId),
        },
      },
      select: { id: true },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this project');
    }

    const messages = await prisma.message.findMany({
      where: { roomId: room.id },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: {
        id: true,
        content: true,
        createdAt: true,
        isDelete: true,
        senderId: true,
        sender: {
          select: { name: true, avatar: true },
        },
        replyTo: {
          select: { id: true, content: true, isDelete: true },
        },
      },
    });

    return messages.map((message) => ({
      id: message.id,
      roomUuid,
      content: message.isDelete
        ? 'Tin nhắn đã bị xóa'
        : (message.content ?? ''),
      sender: {
        id: message.senderId.toString(),
        name: message.sender.name,
        avatar: message.sender.avatar,
      },
      replyTo: message.replyTo
        ? {
            id: message.replyTo.id,
            content: message.replyTo.isDelete ? null : message.replyTo.content,
          }
        : null,
      createAt: message.createdAt.toISOString(),
      deleted: message.isDelete,
    }));
  }

  async deleteMessage(messageId: string, roomUuid: string, senderId: string) {
    const result = await prisma.message.updateMany({
      where: {
        id: messageId,
        senderId: BigInt(senderId),
        isDelete: false,
        room: { uuid: roomUuid },
      },
      data: {
        isDelete: true,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Message was not found or cannot be deleted');
    }
  }
}

export class MessageRepository {}
