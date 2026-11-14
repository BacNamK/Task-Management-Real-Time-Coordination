'use server';

import { api } from '../../../service/api.Interceptor';
import type { NotificationInboxItem } from './notification.type';

const NOTIFICATION_API_PATH = '/notifications';

export async function getNotifications() {
    return api.get<NotificationInboxItem[]>(`${NOTIFICATION_API_PATH}`);
}

export async function acceptInviteProject(acctionId: string) {
    return api.post(`${NOTIFICATION_API_PATH}/acceptinvite`, { acctionId });
}
