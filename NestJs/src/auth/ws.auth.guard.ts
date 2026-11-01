// ws-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'node:fs';
import { join } from 'path';
import type { JwtPayload } from 'jsonwebtoken';
const publicKey = readFileSync(
  join(process.cwd(), 'keys', 'public.pem'),
  'utf8',
);
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client: Socket = context.switchToWs().getClient<Socket>();
    this.authenticate(client);
    return true;
  }

  use(client: Socket, next: (error?: Error) => void): void {
    try {
      this.authenticate(client);
      next();
    } catch (error) {
      next(
        new Error(
          error instanceof WsException ? error.message : 'INVALID_TOKEN',
        ),
      );
    }
  }

  private authenticate(client: Socket): void {
    const token = client.handshake.auth?.token || client.handshake.query?.token;

    if (typeof token !== 'string') {
      throw new WsException('TOKEN_NOT_FOUND');
    }

    let payload: JwtPayload;
    try {
      const verified = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        issuer: 'nextjs-bff',
        audience: 'nestjs-websocket',
      });
      if (typeof verified === 'string') {
        throw new WsException('INVALID_TOKEN');
      }
      payload = verified;
    } catch {
      throw new WsException('INVALID_TOKEN');
    }

    if (
      payload.tokenUse !== 'websocket' ||
      typeof payload.userId !== 'string' ||
      payload.sub !== payload.userId
    ) {
      throw new WsException('INVALID_TOKEN');
    }

    client.data.user = payload;
  }
}
