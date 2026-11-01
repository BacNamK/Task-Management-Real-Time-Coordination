import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import type { Namespace, Socket } from 'socket.io';
import type {
  MessageEmit,
  MessagePayload,
  MessageSendType,
} from './conOnce.types.js';
import { ChatService } from './chat/chat.service.js';
import { WsAuthGuard } from '../../../auth/ws.auth.guard.js';

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
    private readonly ChatService: ChatService,
    private readonly wsAuthGuard: WsAuthGuard,
  ) {}

  @WebSocketServer()
  server: Namespace;

  afterInit(server: Namespace) {
    server.use((client, next) => this.wsAuthGuard.use(client, next));
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('notification')
  handleEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): string {
    this.server.emit('notification', data); // Broadcast to all clients
    return data; // Return synchronous response to sender
  }

  @SubscribeMessage('persitent')
  handlePersitent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): string {
    this.server.emit('persitent', data); // Broadcast to all clients
    return data; // Return synchronous response to sender
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomUuid: string,
  ) {
    // Cần kiểm tra user hiện tại có quyền tham gia phòng này trước khi join.
    await client.join(roomUuid);
  }

  @SubscribeMessage('chats')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MessagePayload,
  ) {
    const userId: unknown = client.data.user?.userId;
    if (typeof userId !== 'string' || !/^\d+$/.test(userId)) {
      throw new WsException('USER_ID_NOT_FOUND');
    }

    const message: MessageSendType = {
      ...data,
      senderId: BigInt(userId),
    };
    await this.ChatService.sendMessage(message);

    const emittedMessage: MessageEmit = {
      ...data,
      senderId: userId,
      createAt: new Date().toISOString(),
    };
    client.to(data.roomUuid).emit('chats', emittedMessage);
  }
}
