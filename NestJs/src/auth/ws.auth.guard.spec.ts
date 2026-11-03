import type { ExecutionContext } from '@nestjs/common';
import { WsAuthGuard } from './ws.auth.guard.js';

describe('WsAuthGuard', () => {
  it('does not apply WebSocket authentication to HTTP requests', async () => {
    const context = {
      getType: () => 'http',
      switchToWs: () => {
        throw new Error('HTTP requests must not access the WebSocket context');
      },
    } as unknown as ExecutionContext;

    await expect(new WsAuthGuard().canActivate(context)).resolves.toBe(true);
  });

  it('allows events on a socket authenticated during the handshake', async () => {
    const context = {
      getType: () => 'ws',
      switchToWs: () => ({
        getClient: () => ({ data: { user: { userId: '1' } } }),
      }),
    } as unknown as ExecutionContext;

    await expect(new WsAuthGuard().canActivate(context)).resolves.toBe(true);
  });

  it('rejects WebSocket events without an authenticated handshake', async () => {
    const context = {
      getType: () => 'ws',
      switchToWs: () => ({
        getClient: () => ({ data: {} }),
      }),
    } as unknown as ExecutionContext;

    await expect(new WsAuthGuard().canActivate(context)).rejects.toThrow(
      'UNAUTHENTICATED_SOCKET',
    );
  });
});
