import { Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../../../../redis/redis.constants.js';
import { projectRepository } from '../../../project/project.Repository.js';

const PRESENCE_TTL_MS = 120_000;
const CLEAR_PRESENCE_IF_SOCKET_MATCHES = `
  if redis.call('GET', KEYS[1]) ~= ARGV[1] then
    return 0
  end

  redis.call('DEL', KEYS[1])
  for index = 2, #KEYS do
    redis.call('ZREM', KEYS[index], ARGV[2])
  end
  return 1
`;

@Injectable()
export class PresenceService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    private readonly ProjectRepository: projectRepository,
  ) {}

  async refreshPresence(
    client: Socket,
  ): Promise<{ userId: string; projectUuids: string[] }> {
    const userId = this.getUserId(client);
    await this.redis.set(
      this.getPresenceKey(client),
      client.id,
      'PX',
      PRESENCE_TTL_MS,
    );
    const projectUuids = await this.setPersenceProjects(userId);
    return { userId, projectUuids };
  }

  async clearPresence(
    client: Socket,
    hasOtherConnections: boolean,
  ): Promise<void> {
    if (!hasOtherConnections) {
      const userId = this.getUserId(client);
      const projectUuids =
        await this.ProjectRepository.returnProjectMemberUuid(userId);

      const projectKeys = projectUuids.map(
        (projectUuid: string) => `projectActive:${projectUuid}`,
      );
      await this.redis.eval(
        CLEAR_PRESENCE_IF_SOCKET_MATCHES,
        projectKeys.length + 1,
        this.getPresenceKey(client),
        ...projectKeys,
        client.id,
        userId,
      );
    }
  }

  private getUserId(client: Socket): string {
    const userId: unknown = client.data.user?.userId;
    if (typeof userId !== 'string' || !/^\d+$/.test(userId)) {
      throw new WsException('USER_ID_NOT_FOUND');
    }

    return userId;
  }

  private getPresenceKey(client: Socket): string {
    return `persence:${this.getUserId(client)}`;
  }

  async setPersenceProjects(userId: string): Promise<string[]> {
    const projectUuids: string[] =
      await this.ProjectRepository.returnProjectMemberUuid(userId);

    for (const projectUuid of projectUuids) {
      await this.redis.zadd(
        `projectActive:${projectUuid}`,
        Date.now() + PRESENCE_TTL_MS,
        userId,
      );
    }

    return projectUuids;
  }

  async getPersenceProject(projectUuid: string): Promise<string[]> {
    if (!projectUuid) return [];

    const key = `projectActive:${projectUuid}`;
    await this.redis.zremrangebyscore(key, '-inf', Date.now());
    return this.redis.zrange(key, '0', '-1');
  }
}
