import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Namespace } from 'socket.io';
import { serializeBigInt } from '../../../../common/utils/bigint.util.js';

@WebSocketGateway({
  namespace: '/connect1',
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Namespace;

  handleToEntity(userId: string, data: unknown): void {
    const payload = JSON.parse(serializeBigInt(data));
    this.server.to(`user:${userId}`).emit('notification', payload);
  }
}
