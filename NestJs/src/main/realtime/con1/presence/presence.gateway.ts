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

  @SubscribeMessage('joinProject')
  async handlePersenceProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() projectUuid: string,
  ) {
    await this.presenceService.refreshPresence(client);
    await client.join(projectUuid);

    const userActives =
      await this.presenceService.getPersenceProject(projectUuid);
    this.server.to(projectUuid).emit('userActives', userActives);
  }

  @SubscribeMessage('leaveProject')
  async handleLeaveProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() projectUuid: string,
  ) {
    await client.leave(projectUuid);
  }
}
