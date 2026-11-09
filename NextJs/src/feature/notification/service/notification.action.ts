'use server';

import { api } from '../../../service/api.Interceptor';
import type { NotificationInboxItem } from './notification.type';

export async function getNotifications() {
    return api.get<NotificationInboxItem[]>('/notifications');
}
