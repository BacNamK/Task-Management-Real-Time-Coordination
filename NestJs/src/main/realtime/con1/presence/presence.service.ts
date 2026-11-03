import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { projectRepository } from '../../../project/project.Repository.js';

@Injectable()
export class PresenceService {
  constructor(
    @Inject(CACHE_MANAGER) private CaheManage: Cache,
    private readonly ProjectRepository: projectRepository,
  ) {}
  async refreshPresence(client: Socket): Promise<void> {
    await this.CaheManage.set(this.getPresenceKey(client), true, 120_000);
  }

  async clearPresence(
    client: Socket,
    hasOtherConnections: boolean,
  ): Promise<void> {
    if (!hasOtherConnections) {
      await this.CaheManage.del(this.getPresenceKey(client));
    }
  }

  getPresenceKey(client: Socket): string {
    const userId: unknown = client.data.user?.userId;
    if (typeof userId !== 'string' || userId.length === 0) {
      throw new WsException('USER_ID_NOT_FOUND');
    }

    return `presence:${userId}`;
  }

  async listUserId(client: Socket, projectId: unknown) {
    const userId: unknown = client.data.user?.userId;
    if (typeof userId !== 'string' || !/^\d+$/.test(userId)) {
      throw new WsException('USER_ID_NOT_FOUND');
    }

    const normalizedProjectId =
      typeof projectId === 'number' && Number.isSafeInteger(projectId)
        ? String(projectId)
        : projectId;
    if (
      typeof normalizedProjectId !== 'string' ||
      !/^\d+$/.test(normalizedProjectId)
    ) {
      throw new WsException('INVALID_PROJECT_ID');
    }

    const result = await this.ProjectRepository.returnProjectMember(
      userId,
      normalizedProjectId,
    );

    const presenceByUser = await Promise.all(
      result.map(async (memberId) => ({
        memberId,
        isOnline: (await this.CaheManage.get(`presence:${memberId}`)) != null,
      })),
    );

    return presenceByUser
      .filter(({ isOnline }) => isOnline)
      .map(({ memberId }) => memberId);
  }
}
