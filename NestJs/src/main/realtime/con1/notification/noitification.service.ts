import { Inject, Injectable } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../../../../redis/redis.constants.js';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async checkActiveUser(userId: string): Promise<string | null> {
    return this.redis.get(`persence:${userId}`);
  }
}
