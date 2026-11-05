import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.constants.js';

export const redisProvider = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    return new Redis({
      host: '127.0.0.1',
      port: Number(process.env.REDIS_PORT || 6379),
      password: process.env.REDIS_PASSWORD || undefined,
      db: Number(process.env.REDIS_DB || 0),

      retryStrategy(times) {
        return Math.min(times * 500, 5000);
      },

      maxRetriesPerRequest: 3,
    });
  },
};
