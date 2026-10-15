import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

const authConfig = {
    providers: [Google],
    session: { strategy: 'jwt' },
} satisfies NextAuthConfig;

export default authConfig;