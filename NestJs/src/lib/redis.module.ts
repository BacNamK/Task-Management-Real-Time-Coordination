import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    CacheModule.register({
      stores: [
        new KeyvRedis(process.env.REDIS_URL ?? 'redis://localhost:6379'),
      ],
      ttl: 120_000,
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}
