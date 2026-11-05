import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.constants.js';
import { redisProvider } from './redis.provider.js';

class RedisLifecycle implements OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async onModuleDestroy() {
    await this.redis.quit();
  }
}

@Global()
@Module({
  providers: [redisProvider, RedisLifecycle],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
