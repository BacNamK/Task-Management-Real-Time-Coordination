import NextAuth, { type DefaultSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

import { prisma } from './prisma';
import authConfig from './auth.config';

declare module 'next-auth' {
    interface User {
        role?: string;
    }
    interface Session {
        user: {
            role?: string;
        } & DefaultSession['user'];
        accessToken?: string;
        error?: 'RefreshAccessTokenError';
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        error?: 'RefreshAccessTokenError';
        role?: string;
    }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
    if (!token.refreshToken) {
        return { ...token, error: 'RefreshAccessTokenError' };
    }

    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.AUTH_GOOGLE_ID ?? '',
                client_secret: process.env.AUTH_GOOGLE_SECRET ?? '',
                grant_type: 'refresh_token',
                refresh_token: token.refreshToken,
            }),
        });

        const refreshedTokens: {
            access_token?: string;
            expires_in?: number;
            refresh_token?: string;
        } = await response.json();

        if (!response.ok || !refreshedTokens.access_token) {
            throw new Error('Google access token refresh failed');
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + (refreshedTokens.expires_in ?? 3600) * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
            error: undefined,
        };
    } catch {
        return { ...token, error: 'RefreshAccessTokenError' };
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpires = account.expires_at
                    ? account.expires_at * 1000
                    : undefined;
            }

            if (
                token.accessToken &&
                token.accessTokenExpires &&
                Date.now() < token.accessTokenExpires - 60_000
            ) {
                return token;
            }

            if (token.refreshToken) {
                token = await refreshAccessToken(token);
            }

            if (user?.role) {
                token.role = user.role;
            }

            if (token.email) {
                //
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email },
                    select: { id: true },
                });

                if (dbUser) {
                    const roleUser = await prisma.roleUser.findFirst({
                        where: { userId: dbUser.id },
                        select: {
                            role: {
                                select: { roleName: true },
                            },
                        },
                    });

                    if (roleUser) {
                        token.role = roleUser.role.roleName;
                    }
                }
            }

            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.error = token.error;
            if (token.role) {
                session.user.role = token.role;
            }

            return session;
        },
    },
});
