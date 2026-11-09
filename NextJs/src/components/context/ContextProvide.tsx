'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSocket } from '../../lib/socket/socketConText';

export type NotificationData = {
    actorId: string;
    actorName?: string;
    actorAvatar?: string | null;
    createdAt: string;
    entityId: string | null;
    entityType: string | null;
    id: string;
    message: string | null;
    metadata: Record<string, unknown> | null;
    title: string;
    type: string;
};

export type AuthUser = {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
} | null;

export const AuthContext = createContext<AuthUser>(null);

type NotificationContextValue = {
    notifications: NotificationData[];
    addNotification: (notification: NotificationData) => void;
    hasNewNotification: boolean;
    clearNewNotification: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

function isNotificationData(data: unknown): data is NotificationData {
    if (typeof data !== 'object' || data === null) return false;

    const notification = data as Record<string, unknown>;
    return (
        typeof notification.actorId === 'string' &&
        (notification.actorName === undefined || typeof notification.actorName === 'string') &&
        (notification.actorAvatar === undefined ||
            typeof notification.actorAvatar === 'string' ||
            notification.actorAvatar === null) &&
        typeof notification.createdAt === 'string' &&
        (typeof notification.entityId === 'string' || notification.entityId === null) &&
        (typeof notification.entityType === 'string' || notification.entityType === null) &&
        typeof notification.id === 'string' &&
        (typeof notification.message === 'string' || notification.message === null) &&
        (notification.metadata === null ||
            (typeof notification.metadata === 'object' &&
                !Array.isArray(notification.metadata))) &&
        typeof notification.title === 'string' &&
        typeof notification.type === 'string'
    );
}

export default function ContextProvide({
    children,
    user,
}: {
    children: React.ReactNode;
    user?: AuthUser;
}) {
    const value = useMemo(() => user ?? null, [user]);

    const socket = useSocket();
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const addNotification = useCallback((notification: NotificationData) => {
        setNotifications((current) =>
            current.some((item) => item.id === notification.id)
                ? current
                : [notification, ...current]
        );
    }, []);
    const clearNewNotification = useCallback(() => {
        setHasNewNotification(false);
    }, []);

    useEffect(() => {
        if (!socket || !user?.id) return;

        const handleNotification = (data: unknown) => {
            if (!isNotificationData(data)) {
                console.error('Received an invalid notification payload:', data);
                return;
            }

            addNotification(data);
            setHasNewNotification(true);
        };
        socket.on('notification', handleNotification);

        return () => {
            socket.off('notification', handleNotification);
        };
    }, [addNotification, socket, user?.id]);

    const notificationValue = useMemo(
        () => ({
            notifications,
            addNotification,
            hasNewNotification,
            clearNewNotification,
        }),
        [notifications, addNotification, hasNewNotification, clearNewNotification]
    );

    return (
        <AuthContext.Provider value={value}>
            <NotificationContext.Provider value={notificationValue}>
                {children}
            </NotificationContext.Provider>
        </AuthContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within ContextProvide.');
    }
    return context;
}
