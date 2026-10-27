'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useItemsStore } from '../../../hooks/projectHook';
import { FormCreateBoard } from '../../board/ui/form/Create';
import BoxMember from './component/BoxMember';
import BoxChat from '../../chat/ui/BoxChat';
import { useParams } from 'next/navigation';
import {
    ArrowUpRight,
    BriefcaseBusiness,
    CalendarDays,
    Columns3,
    LayoutGrid,
    MessageCircle,
    Settings,
    UsersRound,
    type LucideIcon,
} from 'lucide-react';
import type { projectDetail } from '../sevice/project.type';

const PageDetail = ({ data }: { data: projectDetail }) => {
    const paragam = useParams<{ uuid: string }>();

    const [activeTab, setActiveTab] = useState<
        'overview' | 'list' | 'chat' | 'members' | 'setting'
    >('overview');
    const setMembers = useItemsStore((state) => state.setMembers);
    const boards = data.boards ?? [];
    const members = data.members ?? [];

    useEffect(() => {
        setMembers(data.members ?? []);
    }, [data.members, setMembers]);

    const createdAt = data.createdAt
        ? new Date(data.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : 'Unknown date';
    const tabs: { id: typeof activeTab; label: string; icon: LucideIcon }[] = [
        { id: 'overview', label: 'Overview', icon: BriefcaseBusiness },
        { id: 'list', label: 'Boards', icon: LayoutGrid },
        { id: 'chat', label: 'Chat Room', icon: MessageCircle },
        { id: 'members', label: 'Members', icon: UsersRound },
        { id: 'setting', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="PageDetail-project flex h-full min-h-0 w-full overflow-hidden bg-slate-50/60">
            {/* Main content */}
            <div className="flex min-w-0 w-full flex-1 flex-col p-4 sm:p-6">
                {/* Tabs */}
                <div className="flex shrink-0 flex-col gap-3 border-b shadow-[0_8px_6px_-6px_rgba(0,0,0,0.1)] border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
                    <div
                        aria-label="Project sections"
                        className="flex min-w-0 items-center gap-1 overflow-x-auto"
                        role="tablist"
                    >
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button
                                aria-selected={activeTab === id}
                                key={id}
                                onClick={() => setActiveTab(id)}
                                role="tab"
                                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                    activeTab === id
                                        ? ' text-indigo-700'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <Icon aria-hidden="true" size={16} />
                                {label}
                            </button>
                        ))}
                    </div>
                    {activeTab === 'list' && (
                        <div className="shrink-0 sm:ml-auto">
                            <FormCreateBoard projectUuid={paragam.uuid} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
                    {activeTab === 'overview' && (
                        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-5">
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <header className="flex items-start gap-4 px-6 py-6 sm:px-8">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <BriefcaseBusiness aria-hidden="true" size={22} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Project overview
                                        </p>
                                        <h1 className="mt-1 wrap-break-word text-xl font-semibold text-slate-900">
                                            {data.name}
                                        </h1>
                                        {data.slug && (
                                            <p className="mt-1 text-sm text-slate-500">
                                                {data.slug}
                                            </p>
                                        )}
                                    </div>
                                </header>

                                <div className="mx-6 border-t border-slate-100 sm:mx-8" />

                                <dl className="grid gap-5 px-6 py-6 sm:grid-cols-3 sm:px-8">
                                    <div className="flex items-start gap-3">
                                        <CalendarDays
                                            aria-hidden="true"
                                            className="mt-0.5 shrink-0 text-slate-400"
                                            size={18}
                                        />
                                        <div>
                                            <dt className="text-xs font-medium text-slate-500">
                                                Created
                                            </dt>
                                            <dd className="mt-1 text-sm font-medium text-slate-800">
                                                {createdAt}
                                            </dd>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Columns3
                                            aria-hidden="true"
                                            className="mt-0.5 shrink-0 text-slate-400"
                                            size={18}
                                        />
                                        <div>
                                            <dt className="text-xs font-medium text-slate-500">
                                                Boards
                                            </dt>
                                            <dd className="mt-1 text-sm font-medium text-slate-800">
                                                {boards.length}
                                            </dd>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <UsersRound
                                            aria-hidden="true"
                                            className="mt-0.5 shrink-0 text-slate-400"
                                            size={18}
                                        />
                                        <div>
                                            <dt className="text-xs font-medium text-slate-500">
                                                Members
                                            </dt>
                                            <dd className="mt-1 text-sm font-medium text-slate-800">
                                                {members.length}
                                            </dd>
                                        </div>
                                    </div>
                                </dl>
                            </section>

                            <div className="grid gap-6 lg:grid-cols-2">
                                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                    <div className="mb-5 flex items-center justify-between gap-3">
                                        <div>
                                            <h2 className="text-sm font-semibold text-slate-800">
                                                Boards
                                            </h2>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Boards in this project
                                            </p>
                                        </div>
                                        <Columns3
                                            aria-hidden="true"
                                            className="text-slate-400"
                                            size={18}
                                        />
                                    </div>
                                    {boards.length > 0 ? (
                                        <ul className="divide-y divide-slate-100">
                                            {boards.slice(0, 4).map((board) => (
                                                <li key={board.id}>
                                                    <Link
                                                        href={`/projects/${paragam.uuid}/${board.id}`}
                                                        className="group flex items-center justify-between gap-3 py-3"
                                                    >
                                                        <span className="truncate text-sm font-medium text-slate-700 transition group-hover:text-indigo-600">
                                                            {board.title}
                                                        </span>
                                                        <span className="flex shrink-0 items-center gap-2 text-xs text-slate-500">
                                                            {board._count?.tasks ?? 0} tasks
                                                            <ArrowUpRight
                                                                aria-hidden="true"
                                                                className="text-slate-400 transition group-hover:text-indigo-600"
                                                                size={15}
                                                            />
                                                        </span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                                            No boards yet. Create a board to start organizing your
                                            work.
                                        </p>
                                    )}
                                </section>

                                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                    <div className="mb-5 flex items-center justify-between gap-3">
                                        <div>
                                            <h2 className="text-sm font-semibold text-slate-800">
                                                Members
                                            </h2>
                                            <p className="mt-1 text-xs text-slate-500">
                                                People collaborating on this project
                                            </p>
                                        </div>
                                        <UsersRound
                                            aria-hidden="true"
                                            className="text-slate-400"
                                            size={18}
                                        />
                                    </div>
                                    {members.length > 0 ? (
                                        <ul className="space-y-3">
                                            {members.slice(0, 5).map((member, index) => {
                                                const name =
                                                    member.user?.name ?? member.name ?? 'Member';
                                                return (
                                                    <li
                                                        className="flex items-center gap-3"
                                                        key={member.id ?? member.user?.id ?? index}
                                                    >
                                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
                                                            {name
                                                                .trim()
                                                                .split(/\s+/)
                                                                .slice(0, 2)
                                                                .map((part: string) => part[0])
                                                                .join('')
                                                                .toUpperCase()}
                                                        </span>
                                                        <span className="min-w-0 truncate text-sm font-medium text-slate-700">
                                                            {name}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                                            No members in this project yet.
                                        </p>
                                    )}
                                </section>
                            </div>
                        </div>
                    )}
                    {activeTab === 'list' && (
                        <div className="flex flex-col gap-5">
                            {/* Board list */}
                            {boards.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {boards.map((board) => (
                                        <Link
                                            href={`/projects/${paragam.uuid}/${board.id}`}
                                            key={board.id}
                                            className="group flex min-w-0 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                                        >
                                            {/* Board title */}
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                                        <Columns3 aria-hidden="true" size={17} />
                                                    </div>
                                                    <h3 className="truncate text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                                                        {board.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="border-t border-slate-100" />

                                            {/* Board statistics */}
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs">
                                                        {board._count?.cycle ?? 0} Cycles
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs">
                                                        {board._count?.tasks ?? 0} Tasks
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                                    <h3 className="mt-4 text-sm font-semibold text-slate-700">
                                        No boards yet
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-400">
                                        Create a board to start organizing your work.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'chat' && (
                        <div className="h-full min-h-0 overflow-hidden">
                            <BoxChat />
                        </div>
                    )}
                    {activeTab === 'members' && (
                        <div className="h-full min-h-0 overflow-hidden shadow-sm">
                            <BoxMember members={members} projectUuid={data.uuid} />
                        </div>
                    )}
                    {activeTab === 'setting' && (
                        <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <header className="flex items-center gap-3 border-b border-slate-100 px-6 py-5 sm:px-8">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Settings aria-hidden="true" size={18} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-900">
                                        Project details
                                    </h2>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Basic information about this project.
                                    </p>
                                </div>
                            </header>
                            <dl className="divide-y divide-slate-100 px-6 sm:px-8">
                                <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-4">
                                    <dt className="text-xs font-medium text-slate-500">Name</dt>
                                    <dd className="wrap-break-word text-sm font-medium text-slate-800">
                                        {data.name}
                                    </dd>
                                </div>
                                <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-4">
                                    <dt className="text-xs font-medium text-slate-500">Slug</dt>
                                    <dd className="wrap-break-word text-sm text-slate-700">
                                        {data.slug || 'Not set'}
                                    </dd>
                                </div>
                                <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-4">
                                    <dt className="text-xs font-medium text-slate-500">
                                        Project ID
                                    </dt>
                                    <dd className="break-all font-mono text-xs text-slate-600">
                                        {data.uuid}
                                    </dd>
                                </div>
                                <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-4">
                                    <dt className="text-xs font-medium text-slate-500">Created</dt>
                                    <dd className="text-sm text-slate-700">{createdAt}</dd>
                                </div>
                            </dl>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageDetail;
