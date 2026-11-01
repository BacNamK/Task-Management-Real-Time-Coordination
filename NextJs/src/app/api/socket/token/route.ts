import { auth } from '../../../../lib/auth/auth';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const privateKey = readFileSync(join(process.cwd(), 'keys', 'private.pem'), 'utf8');

export async function GET() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json(
            { message: 'UNAUTHORIZED' },
            { status: 401, headers: { 'Cache-Control': 'no-store' } }
        );
    }

    const token = jwt.sign(
        { sub: userId, userId, tokenUse: 'websocket' },
        privateKey,
        {
            algorithm: 'RS256',
            issuer: 'nextjs-bff',
            audience: 'nestjs-websocket',
            expiresIn: '2m',
        }
    );

    return NextResponse.json(
        { token },
        { headers: { 'Cache-Control': 'no-store' } }
    );
}
