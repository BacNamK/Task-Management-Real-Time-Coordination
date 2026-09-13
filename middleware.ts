// middleware.ts
import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';

import authConfig from '@/src/lib/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const nextUrl = req.nextUrl;

    if (isLoggedIn) {
        return NextResponse.redirect(new URL('/home', nextUrl));
    }

    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/login', nextUrl));
    }

    return NextResponse.next();
});

// Cấu hình các đường dẫn sẽ chạy qua Middleware này
export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*', '/login'],
};
