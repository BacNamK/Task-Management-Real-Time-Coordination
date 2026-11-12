'use client';

import { useMemo, useState } from 'react';
import { Check, CheckCheck, UsersRound } from 'lucide-react';
import { useNotifications } from '../../components/context/ContextProvide';
import type { NotificationInboxItem } from './service/notification.type';
import Image from 'next/image';

type Filter = 'all' | 'unread';

export const PageClient = ({
    initialNotifications,
}: {
    initialNotifications: NotificationInboxItem[];
}) => {
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

    return (
        <div className="h-full w-full overflow-y-auto bg-slate-50/60">
            <main className="mx-auto flex h-full w-full max-w-full flex-col gap-6 p-5 sm:p-8">
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

                    <div className="divide-y divide-slate-100">
                        {visibleNotifications.map((notification) => {
                            const isRead =
                                notification.isRead || readNotifications.includes(notification.id);
                            const createdAt = new Date(notification.createdAt);
                            const hasValidDate = Number.isFinite(createdAt.getTime());
                            const date = hasValidDate
                                ? new Intl.DateTimeFormat('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      timeZone: 'UTC',
                                  }).format(createdAt)
                                : 'Unknown date';

                            return (
                                <article
                                    key={notification.id}
                                    className={`flex gap-4 px-5 py-5 transition-colors sm:px-6 ${
                                        isRead ? 'bg-white' : 'bg-indigo-50/30'
                                    }`}
                                >
                                    <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-indigo-700">
                                        {notification.sender?.avatar ? (
                                            <Image
                                                src={notification.sender.avatar}
                                                alt={notification.sender.name ?? ''}
                                                width={20}
                                                height={20}
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <UsersRound aria-hidden="true" size={20} />
                                        )}
                                        {!isRead && (
                                            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-indigo-600" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-indigo-700">
                                                        Project invitation
                                                    </span>
                                                    <span className="text-[11px] font-medium text-slate-400">
                                                        {typeof notification.type === 'string'
                                                            ? notification.type.replaceAll('_', ' ')
                                                            : 'NOTIFICATION'}
                                                    </span>
                                                </div>
                                                <h2 className="text-sm font-semibold leading-6 text-slate-900 sm:text-base">
                                                    {notification.title}
                                                </h2>
                                                {notification.sender && (
                                                    <p className="mt-1 text-xs font-medium text-slate-500">
                                                        {notification.sender.name}
                                                    </p>
                                                )}
                                                {notification.message && (
                                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                                        {notification.message}
                                                    </p>
                                                )}
                                            </div>
                                            <time
                                                dateTime={
                                                    hasValidDate
                                                        ? createdAt.toISOString()
                                                        : undefined
                                                }
                                                className="shrink-0 text-xs text-slate-400"
                                            >
                                                {date}
                                            </time>
                                        </div>
                                        {!isRead && (
                                            <button
                                                type="button"
                                                onClick={() => markAsRead(notification.id)}
                                                className="mt-4 inline-flex items-center gap-1.5 rounded-md text-xs font-semibold text-indigo-600 transition hover:text-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            >
                                                <Check aria-hidden="true" size={14} />
                                                Mark as read
                                            </button>
                                        )}
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
