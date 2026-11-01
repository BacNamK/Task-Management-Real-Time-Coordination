import type { ExecutionContext } from '@nestjs/common';
import { WsAuthGuard } from './ws.auth.guard.js';

describe('WsAuthGuard', () => {
  it('does not apply WebSocket authentication to HTTP requests', async () => {
    const context = {
      getType: () => 'http',
      switchToWs: vi.fn(),
    } as unknown as ExecutionContext;

    await expect(new WsAuthGuard().canActivate(context)).resolves.toBe(true);
    expect(context.switchToWs).not.toHaveBeenCalled();
  });
});
