export type NotificationData = {
    actorId: string;
    sender?: { name: string | null; avatar: string | null };
    createdAt: string;
    expiredAt: Date;
    status: string;
    entityId: string | null;
    entityType: string | null;
    id: string;
    actionrequest: {
        metadata: {
            path: string;
        };
    };
    message: string | null;
    metadata: {
        path: string | null;
        target: string;
    };
    title: string;
    type: string;
};
export type NotificationInboxItem = NotificationData & {
    isRead: boolean;
    readAt: string | null;
};
