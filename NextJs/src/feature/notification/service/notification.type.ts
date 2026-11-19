export type NotificationData = {
    actorId: string;
    sender?: { name: string | null; avatar: string | null };
    createdAt: string;
    expiredAt: Date;
    status: string;
    entityId: string | null;
    entityType: string | null;
    id: string;
    actionrequestId: string;
    message: string | null;
    metadata: string | null;
    title: string;
    type: string;
};
export type NotificationInboxItem = NotificationData & {
    isRead: boolean;
    readAt: string | null;
};
