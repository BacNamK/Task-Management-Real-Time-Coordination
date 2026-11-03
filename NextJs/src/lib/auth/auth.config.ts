import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

const authConfig = {
    trustHost: true,
    providers: [Google],
    session: { strategy: 'jwt' },
} satisfies NextAuthConfig;

export default authConfig;
