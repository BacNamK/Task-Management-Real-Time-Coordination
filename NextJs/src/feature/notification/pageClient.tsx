'use client';

import { useMemo, useState } from 'react';
import { CheckCheck, Eye, UsersRound } from 'lucide-react';
import { useNotifications } from '../../components/context/ContextProvide';
import type { NotificationInboxItem } from './service/notification.type';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Filter = 'all' | 'unread';

export const PageClient = ({
    initialNotifications,
}: {
    initialNotifications: NotificationInboxItem[];
}) => {
    const router = useRouter();

    console.log(initialNotifications);

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

    const markAsRead = (id: string) => {
        setReadNotifications((current) => (current.includes(id) ? current : [...current, id]));
    };

    const hanldeRedirect = (link: string, id: string) => {
        const param = new URLSearchParams({ id });

        router.push(`${link}?${param.toString()}`);
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
                                                {notification.title}
                                            </h2>

                                            <div className="mt-2 flex items-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        hanldeRedirect(
                                                            notification?.metadata,
                                                            notification?.actionrequestId
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 rounded text-xs font-medium text-slate-600 transition hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                    <Eye aria-hidden="true" size={13} />
                                                    Preview
                                                </button>

                                                <span className="text-sm text-slate-500">
                                                    {date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
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
