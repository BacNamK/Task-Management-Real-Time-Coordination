import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import type { Namespace, Socket } from 'socket.io';
import { WsAuthGuard } from '../../../auth/ws.auth.guard.js';
import { PresenceService } from './presence/presence.service.js';
import { UserId } from '../../../common/decorators/decorator-id.js';
import { projectRepository } from '../../project/project.Repository.js';

// kết nối 1 sử lí các sự kiện thông báo,trực tuyến,tin nhắn,gọi

@WebSocketGateway({
  namespace: '/connect1',
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
})
export class ConnectionOne
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly wsAuthGuard: WsAuthGuard,
    private readonly presenceService: PresenceService,
    private readonly projectRepository: projectRepository,
  ) {}

  @WebSocketServer()
  server: Namespace;

  afterInit(server: Namespace) {
    server.use((client, next) => this.wsAuthGuard.use(client, next));
    console.log('WebSocket Gateway Initialized');
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    await client.join(`user:${client.data.user.userId}`);
    const { userId, projectUuids } =
      await this.presenceService.refreshPresence(client);
    this.server.to(projectUuids).emit('userActive', userId);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const userId: unknown = client.data.user?.userId;
    const hasOtherConnections =
      typeof userId === 'string' &&
      (await this.server.fetchSockets()).some(
        (socket) => socket.data.user?.userId === userId,
      );
    await this.presenceService.clearPresence(client, hasOtherConnections);

    const projectUuids =
      typeof userId === 'string'
        ? await this.projectRepository.returnProjectsMemberUuid(userId)
        : [];
    this.server.to(projectUuids).emit('userOff', userId);
  }
}
