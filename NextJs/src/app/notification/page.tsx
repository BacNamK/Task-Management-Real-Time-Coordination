import { PageClient } from '../../feature/notification/pageClient';
import { getNotifications } from '../../feature/notification/service/notification.action';

export default async function Page() {
    const notifications = await getNotifications();
    return <PageClient initialNotifications={notifications} />;
}
