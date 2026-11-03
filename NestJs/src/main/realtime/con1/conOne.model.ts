import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module.js';
import { ConnectionOne } from './conOne.gateway.js';
import { WsAuthGuard } from '../../../auth/ws.auth.guard.js';
import { PresenceModule } from './presence/presence.module.js';

@Module({
  imports: [ChatModule, PresenceModule],
  providers: [ConnectionOne, WsAuthGuard],
  exports: [WsAuthGuard],
})
export class ConOneModel {}
