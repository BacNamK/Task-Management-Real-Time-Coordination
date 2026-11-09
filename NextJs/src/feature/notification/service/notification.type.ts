import type { NotificationData } from '../../../components/context/ContextProvide';

export type NotificationInboxItem = NotificationData & {
    isRead: boolean;
    readAt: string | null;
};
