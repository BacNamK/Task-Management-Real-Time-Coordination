import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Namespace, Socket } from 'socket.io';
import { PresenceService } from './presence.service.js';

@WebSocketGateway({
  namespace: '/connect1',
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
})
export class PresenceGateway {
  constructor(private readonly presenceService: PresenceService) {}

  @WebSocketServer()
  server: Namespace;

  @SubscribeMessage('heartbeat')
  async handleHeartbeat(@ConnectedSocket() client: Socket) {
    await this.presenceService.refreshPresence(client);
    return { ok: true };
  }

  @SubscribeMessage('persence:query')
  async handlePersitent(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { projectId: unknown },
  ) {
    const list = await this.presenceService.listUserId(
      socket,
      payload?.projectId,
    );
    socket.emit('persence:snapshort', list);
  }
}
