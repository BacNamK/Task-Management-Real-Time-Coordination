// lib/server/service-token.ts
import 'server-only';
import jwt from 'jsonwebtoken';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const privateKey = readFileSync(join(process.cwd(), 'keys', 'private.pem'), 'utf8');

export function createServiceToken() {
    return jwt.sign({ sub: 'nextjs-bff' }, privateKey, {
        algorithm: 'RS256',
        issuer: 'nextjs-bff',
        audience: 'nestjs-api',
        expiresIn: '5m',
    });
}
