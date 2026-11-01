import { Injectable } from '@nestjs/common';
import { prisma } from '../../../../lib/prisma.Client.js';

@Injectable()
export class ChatRepository {
  async createRoom(project_Id: number) {
    await prisma.chatRoom.create({
      data: { name: 'Lobby', projectId: project_Id, isDirect: false },
    });
    await prisma.chatRoom.create({
      data: { name: 'Voice', projectId: project_Id, isDirect: true },
    });
  }
}

export class MessageRepository {}
