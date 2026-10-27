import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestCustom } from '../../auth/auth.middleware.js';

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<RequestCustom>();
    return req.userId;
  },
);
