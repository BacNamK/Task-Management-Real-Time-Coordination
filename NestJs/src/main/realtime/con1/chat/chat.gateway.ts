import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import type { Namespace, Socket } from 'socket.io';
import type { MessagePayload, MessageSendType } from '../conOnce.types.js';
import { ChatService } from './chat.service.js';

@WebSocketGateway({
  namespace: '/connect1',
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Namespace;

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomUuid: string,
  ) {
    // Cần kiểm tra user hiện tại có quyền tham gia phòng này trước khi join.
    await client.join(roomUuid);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomUuid: string,
  ) {
    await client.leave(roomUuid);
  }

  @SubscribeMessage('loadMessages')
  async handleLoadMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomUuid: string },
  ) {
    const userId = this.getUserId(client);
    const messages = await this.chatService.loadMessages(data.roomUuid, userId);
    client.emit('messagesLoaded', { roomUuid: data.roomUuid, messages });
  }

  @SubscribeMessage('chats')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MessagePayload,
  ) {
    const message: MessageSendType = {
      ...data,
      senderId: this.getUserId(client),
    };
    const emittedMessage = await this.chatService.sendMessage(message);

    this.server.to(data.roomUuid).emit('chats', emittedMessage);
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; roomUuid: string },
  ) {
    const deletedMessage = await this.chatService.deleteMessage(
      data.messageId,
      data.roomUuid,
      this.getUserId(client),
    );

    this.server.to(deletedMessage.roomUuid).emit('messageDeleted', {
      messageId: deletedMessage.messageId,
      roomUuid: deletedMessage.roomUuid,
    });
  }

  private getUserId(client: Socket): string {
    const userId: unknown = client.data.user?.userId;
    if (typeof userId !== 'string' || !/^\d+$/.test(userId)) {
      throw new WsException('USER_ID_NOT_FOUND');
    }

    return userId;
  }
}
