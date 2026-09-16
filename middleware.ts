// middleware.ts
import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';

import authConfig from '@/src/lib/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const nextUrl = req.nextUrl;
    const pathname = nextUrl.pathname;

    const authRoutes = ['/login', '/register', '/signup', '/forgot-password', '/reset-password'];
    const isOnAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Đã đăng nhập mà vào trang auth -> đẩy về /home
    if (isOnAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL('/home', nextUrl));
    }

    // Chưa đăng nhập mà vào trang không phải auth -> đẩy về /login
    if (!isLoggedIn && !isOnAuthRoute) {
        return NextResponse.redirect(new URL('/login', nextUrl));
    }

    return NextResponse.next();
});

// Cấu hình các đường dẫn sẽ chạy qua Middleware này
// Loại trừ các path phục vụ auth khỏi matcher
export const config = {
    matcher: [
        '/((?!api/auth|login|register|signup|forgot-password|reset-password|_next/static|_next/image|favicon.ico).*)',
    ],
};
