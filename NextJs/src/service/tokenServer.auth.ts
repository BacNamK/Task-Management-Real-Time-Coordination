import 'server-only';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getSessionUser } from '../lib/auth/auth.session';

const privateKey = readFileSync(join(process.cwd(), 'keys', 'private.pem'), 'utf8');

const tokenCache = new Map<string, { token: string; expiresAt: number }>();
const refreshPromises = new Map<string, Promise<string>>();

async function createServiceToken(userId?: string): Promise<string> {
    return jwt.sign({ sub: 'nextjs-bff', userId }, privateKey, {
        algorithm: 'RS256',
        issuer: 'nextjs-bff',
        audience: 'nestjs-api',
        expiresIn: '5m',
    });
}

export async function getServiceToken(): Promise<string> {
    const session = await getSessionUser();
    const userId = session?.user?.id;
    const cacheKey = userId ?? '';
    const cached = tokenCache.get(cacheKey);

    if (cached && Date.now() < cached.expiresAt - 30_000) {
        return cached.token;
    }

    // Dùng chung một lần tạo token nếu nhiều request đến đồng thời
    let refreshPromise = refreshPromises.get(cacheKey);
    if (!refreshPromise) {
        refreshPromise = createServiceToken(userId)
            .then((token) => {
                tokenCache.set(cacheKey, {
                    token,
                    expiresAt: Date.now() + 5 * 60_000,
                });
                return token;
            })
            .finally(() => {
                refreshPromises.delete(cacheKey);
            });
        refreshPromises.set(cacheKey, refreshPromise);
    }

    return refreshPromise;
}
