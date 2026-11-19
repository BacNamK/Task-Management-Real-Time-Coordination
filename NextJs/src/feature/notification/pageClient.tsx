'use client';

import { useMemo, useState } from 'react';
import { CheckCheck, Eye, UsersRound } from 'lucide-react';
import { useNotifications } from '../../components/context/ContextProvide';
import type { NotificationData, NotificationInboxItem } from './service/notification.type';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { updateSatatus } from './service/notification.action';

type Filter = 'all' | 'unread';

export const PageClient = ({
    initialNotifications,
}: {
    initialNotifications: NotificationInboxItem[];
}) => {
    console.log(initialNotifications);
    const router = useRouter();

    // Trong PageClient:
    const [now, setNow] = useState(() => Date.now());

    const { notifications: liveNotifications } = useNotifications();
    const [filter, setFilter] = useState<Filter>('all');
    const [readNotifications, setReadNotifications] = useState<string[]>([]);
    const notifications = useMemo(() => {
        const byId = new Map(
            initialNotifications.map((notification) => [notification.id, notification] as const)
        );
        for (const notification of liveNotifications) {
            if (!byId.has(notification.id)) {
                byId.set(notification.id, { ...notification, isRead: false, readAt: null });
            }
        }
        return [...byId.values()].sort(
            (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)
        );
    }, [initialNotifications, liveNotifications]);

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead && !readNotifications.includes(notification.id)
    ).length;
    const visibleNotifications =
        filter === 'unread'
            ? notifications.filter(
                  (notification) =>
                      !notification.isRead && !readNotifications.includes(notification.id)
              )
            : notifications;

    const markAsRead = async (notification: NotificationData) => {
        // sử lí UI ở giao diện
        setReadNotifications((current) =>
            current.includes(notification.id) ? current : [...current, notification.id]
        );

        // gửi api cập nhập lại trạng thái thông báo
        await updateSatatus([notification.id]);

        if (notification.type === 'MEMBER_JOINED') {
            const path = notification.actionrequest?.metadata.path;
            if (path) router.push(path);
            return;
        }

        // nếu trường hơp là thông báo nhiệm vụ được giao
        const metadataPath = notification.metadata?.path;
        if (!metadataPath) return;

        const [path, query = ''] = metadataPath.split('?');
        const params = new URLSearchParams(query);

        const target = notification.metadata?.target;
        if (target) params.set('target', target);

        router.push(params.size ? `${path}?${params.toString()}` : path);
    };

    return (
        <div className="h-full w-full overflow-y-auto bg-slate-50/60">
            <main className="mx-auto flex h-full w-full max-w-full flex-col gap-6 pt-2 p-4">
                <section aria-label="Notification inbox" className=" h-full">
                    <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                            <button
                                type="button"
                                aria-pressed={filter === 'all'}
                                onClick={() => setFilter('all')}
                                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                                    filter === 'all'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                All
                            </button>
                            <button
                                type="button"
                                aria-pressed={filter === 'unread'}
                                onClick={() => setFilter('unread')}
                                className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                                    filter === 'unread'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Unread
                                {unreadCount > 0 && (
                                    <span className="flex size-5 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        </div>
                        <p className="text-xs font-medium text-slate-400">
                            {unreadCount === 1
                                ? '1 unread notification'
                                : `${unreadCount} unread notifications`}
                        </p>
                    </div>

                    <div className="divide-y divide-slate-100 grid gap-y-2">
                        {visibleNotifications.map((notification) => {
                            const isRead =
                                notification.isRead || readNotifications.includes(notification.id);
                            const createdAt = new Date(notification.createdAt);
                            const hasValidDate = Number.isFinite(createdAt.getTime());

                            function formatRelative(createdAt: Date) {
                                const diffSec = Math.round(
                                    (createdAt.getTime() - Date.now()) / 1000
                                );
                                const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

                                const units: [Intl.RelativeTimeFormatUnit, number][] = [
                                    ['year', 31536000],
                                    ['month', 2592000],
                                    ['day', 86400],
                                    ['hour', 3600],
                                    ['minute', 60],
                                ];

                                for (const [unit, seconds] of units) {
                                    if (Math.abs(diffSec) >= seconds) {
                                        return rtf.format(Math.round(diffSec / seconds), unit);
                                    }
                                }
                                return 'Vừa xong';
                            }

                            const date = hasValidDate ? formatRelative(createdAt) : 'Unknown date';
                            return (
                                <article
                                    key={notification.id}
                                    onClick={() => markAsRead(notification)}
                                    className={`flex items-center gap-4 shadow p-4 rounded-md ${
                                        isRead ? '' : 'bg-blue-50'
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div className="flex h-13 w-13 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-500">
                                        {notification.sender?.avatar ? (
                                            <Image
                                                src={notification.sender.avatar}
                                                alt={notification.sender.name ?? ''}
                                                width={38}
                                                height={38}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <UsersRound aria-hidden="true" size={18} />
                                        )}
                                    </div>

                                    {/* Nội dung */}
                                    <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0">
                                            <h2 className="text-sm leading-5 text-slate-900">
                                                {notification.type !== 'TASK_ASSIGNED' && (
                                                    <span className="font-bold">
                                                        {notification.sender.name}
                                                    </span>
                                                )}{' '}
                                                <span>
                                                    {notification.title
                                                        ?.split(/(\/[^/]+\/)/g)
                                                        .filter(Boolean)
                                                        .map((part, index) => {
                                                            const isMarked =
                                                                part.startsWith('/') &&
                                                                part.endsWith('/');
                                                            const text = isMarked
                                                                ? part.slice(1, -1)
                                                                : part;

                                                            return isMarked ? (
                                                                <strong
                                                                    key={index}
                                                                    className="font-bold"
                                                                >
                                                                    {text}
                                                                </strong>
                                                            ) : (
                                                                <span key={index}>{text}</span>
                                                            );
                                                        })}
                                                </span>
                                            </h2>

                                            <div className="mt-2 flex items-center gap-4">
                                                <span className="text-sm text-slate-500">
                                                    {date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {notification.status !== 'ACCEPTED' && (
                                        <span className="text-sm p-2 ">
                                            {(() => {
                                                const remaining =
                                                    new Date(notification.expiredAt).getTime() -
                                                    now;

                                                if (!Number.isFinite(remaining) || remaining <= 0)
                                                    return '';

                                                const totalSeconds = Math.floor(remaining / 1000);
                                                const days = Math.floor(totalSeconds / 86400);
                                                const hours = Math.floor(
                                                    (totalSeconds % 86400) / 3600
                                                );

                                                return `${days} day ${hours} hours`;
                                            })()}
                                        </span>
                                    )}
                                </article>
                            );
                        })}

                        {visibleNotifications.length === 0 && (
                            <div className="flex flex-col items-center px-6 py-16 text-center">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                    <CheckCheck aria-hidden="true" size={22} />
                                </div>
                                <h2 className="mt-4 text-sm font-semibold text-slate-800">
                                    You&apos;re all caught up
                                </h2>
                                <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
                                    There are no unread notifications right now.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};
