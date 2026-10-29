import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';

import { UsersModule } from './main/users/user.Module.js';
import { projectModule } from './main/project/project.Module.js';
import { AuthMiddleware } from './auth/auth.middleware.js';
import { UsersAuthModule } from './auth/users/user.auth.module.js';
import { LoggingMiddleware } from './common/logging/logging.middleware.js';
import { BoardModule } from './main/board/board.Module.js';
import { TaskModule } from './main/task/task.Module.js';
import { CycleModule } from './main/cycle/cycle.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'NestJs',
    }),
    UsersModule,
    projectModule,
    BoardModule,
    CycleModule,
    TaskModule,
    UsersAuthModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
