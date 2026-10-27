import 'server-only';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const privateKey = readFileSync(join(process.cwd(), 'keys', 'private.pem'), 'utf8');

let cachedToken: string | null = null;
let expiresAt = 0;
let refreshPromise: Promise<string> | null = null;

async function createServiceToken(): Promise<string> {
    return jwt.sign({ sub: 'nextjs-bff' }, privateKey, {
        algorithm: 'RS256',
        issuer: 'nextjs-bff',
        audience: 'nestjs-api',
        expiresIn: '5m',
    });
}

export async function getServiceToken(): Promise<string> {
    if (cachedToken && Date.now() < expiresAt - 30_000) {
        return cachedToken;
    }

    // Dùng chung một lần tạo token nếu nhiều request đến đồng thời
    if (!refreshPromise) {
        refreshPromise = createServiceToken()
            .then((token) => {
                cachedToken = token;
                expiresAt = Date.now() + 5 * 60_000;
                return token;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}
