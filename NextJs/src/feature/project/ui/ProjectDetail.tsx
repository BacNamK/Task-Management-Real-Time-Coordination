'use client';

import { useActionState, useEffect, useState } from 'react';

import { useItemsStore } from '../../../hooks/projectHook';
import { FormCreateBoard } from '../../board/ui/form/Create';
import Members from './component/Members';
import Overview from './component/OverView';
import Boards from './component/Boards';
import BoxChat from '../../chat/ui/BoxChat';
import { useParams } from 'next/navigation';
import {
    Eye,
    Kanban,
    LayoutGrid,
    MessageCircle,
    Settings,
    UsersRound,
    type LucideIcon,
} from 'lucide-react';
import type { projectDetail } from '../sevice/project.type';
import { useSocket } from '../../../lib/socket/socketConText';
import Preview from './component/PreviewEditer';

const projectTabs = ['overview', 'preview', 'boards', 'chat', 'members', 'setting'] as const;
type ProjectTab = (typeof projectTabs)[number];

const isProjectTab = (value: string | null): value is ProjectTab =>
    projectTabs.some((tab) => tab === value);

const PageDetail = ({ data }: { data: projectDetail }) => {
    const paragam = useParams<{ uuid: string }>();

    const [activeTab, setActiveTab] = useState<ProjectTab>('overview');
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
    const tabs: { id: ProjectTab; label: string; icon: LucideIcon; conponent: any }[] = [
        { id: 'overview', label: 'Overview', icon: LayoutGrid, conponent: Overview },
        { id: 'preview', label: 'Preview', icon: Eye, conponent: Preview },
        { id: 'boards', label: 'Boards', icon: Kanban, conponent: Boards },
        { id: 'chat', label: 'Chat Room', icon: MessageCircle, conponent: BoxChat },
        { id: 'members', label: 'Members', icon: UsersRound, conponent: Members },
        { id: 'setting', label: 'Settings', icon: Settings, conponent: '' },
    ];

    const [userActiveIds, setUserActiveId] = useState<string[]>([]);

    useEffect(() => {
        const syncTabFromUrl = () => {
            const view = new URLSearchParams(window.location.search).get('view');
            setActiveTab(isProjectTab(view) ? view : 'overview');
        };

        syncTabFromUrl();
        window.addEventListener('popstate', syncTabFromUrl);
        return () => window.removeEventListener('popstate', syncTabFromUrl);
    }, []);

    const handleTabChange = (tab: ProjectTab) => {
        setActiveTab(tab);
        const url = new URL(window.location.href);
        url.searchParams.set('view', tab);
        window.history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
    };

    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleSnapshort = (data: any) => {
            setUserActiveId(data);
        };

        const handleUserActive = (userId: string) => {
            setUserActiveId((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
        };

        const hanldeUserOff = (userId: string) => {
            setUserActiveId((prev) => prev.filter((id) => id !== userId));
        };

        const joinProject = () => {
            socket.emit('joinProject', data.uuid);
        };

        socket.on('project:snapshort', handleSnapshort);
        socket.on('userActive', handleUserActive);
        socket.on('userOff', hanldeUserOff);
        socket.on('connect', joinProject);

        if (socket.connected) {
            joinProject();
        }

        return () => {
            socket.off('connect', joinProject);
            if (socket.connected) {
                socket.emit('leaveProject', data.uuid);
            }
            socket.off('userActive', handleUserActive);
            socket.off('userOff', hanldeUserOff);
            socket.off('project:snapshort', handleSnapshort);
        };
    }, [socket, data.uuid]);

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
                                onClick={() => handleTabChange(id)}
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
                    {activeTab === 'boards' && (
                        <div className="shrink-0 sm:ml-auto">
                            <FormCreateBoard projectUuid={paragam.uuid} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
                    {activeTab === 'overview' && <Overview data={data} />}
                    {activeTab === 'boards' && (
                        <Boards boards={boards} projectUuid={paragam.uuid} />
                    )}
                    {activeTab === 'chat' && (
                        <div className="h-full min-h-0 overflow-hidden">
                            <BoxChat chatRooms={data.chatRooms} />
                        </div>
                    )}
                    {activeTab === 'members' && (
                        <Members members={members} projectId={data.id} actives={userActiveIds} />
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
