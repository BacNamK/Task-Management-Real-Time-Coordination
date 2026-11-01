'use client';

import { createContext, useMemo } from 'react';

export type AuthUser = {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
} | null;

export const AuthContext = createContext<AuthUser>(null);

export default function ContextProvide({
    children,
    user,
}: {
    children: React.ReactNode;
    user?: AuthUser;
}) {
    const value = useMemo(() => user ?? null, [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
