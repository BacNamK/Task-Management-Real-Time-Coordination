import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { readFileSync } from 'node:fs';
import { join } from 'path';
const publicKey = readFileSync(
  join(process.cwd(), 'keys', 'public.pem'),
  'utf8',
);

export type RequestCustom = Request & {
  userId: string;
};

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: RequestCustom, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('NO_TOKEN_PROVIDED');
    }

    try {
      jwt.verify(token, publicKey);
    } catch {
      res.status(401).json({ message: 'INVALID_TOKEN_PROVIDED' });
      return;
    }

    const requestPath = (req.originalUrl || req.path).split('?')[0];
    const isAuthRoute = /(?:^|\/)auth(?:\/|$)/.test(requestPath);

    if (!isAuthRoute) {
      const userId = req.get('User-Id');
      if (!userId) {
        throw new UnauthorizedException('NO_USER_ID_PROVIDED');
      }
      req.userId = userId;
    }

    next();
  }
}
