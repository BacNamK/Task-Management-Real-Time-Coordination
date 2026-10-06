'use client';

import Link from 'next/link';
import { FormCreateBoard } from '../../forms/CreateBoard';
import BoxMember from './BoxMember';
import { useEffect, useState } from 'react';
import { useItemsStore } from '@/src/hooks/workspaceHook';
import BoxChat from '../chatroom/BoxChat';

type BoardListData = {
    uuid: string;
    boards: any;
    name: string;
    members: any;
};

const PageClient = ({ data }: { data: BoardListData }) => {
    const [activeTab, setActiveTab] = useState('list');
    const setMembers = useItemsStore((state) => state.setMembers);

    useEffect(() => {
        setMembers(data.members);
    }, []);
    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50">
            {/* Main content */}
            <div className="flex min-w-0 flex-1 flex-col p-5">
                {/* Tabs */}
                <div className="flex h-12 shrink-0 items-center justify-between">
                    <div className="flex h-full items-center gap-2">
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`relative h-full px-5 text-sm font-medium transition ${
                                activeTab === 'list'
                                    ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <span className="flex items-center gap-2">Boards</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`relative h-full px-5 text-sm font-medium transition ${
                                activeTab === 'chat'
                                    ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <span className="flex items-center gap-2">Chat Room</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="min-h-0 flex-1 overflow-y-auto">
                    {activeTab === 'list' ? (
                        <div className="flex flex-col gap-5">
                            {/* Board header */}
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Manage and organize your projects
                                    </p>
                                </div>

                                <div className="shrink-0">
                                    <FormCreateBoard workspaceUuid={data.uuid} />
                                </div>
                            </div>

                            {/* Board list */}
                            {data.boards.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {data.boards.map((board: any) => (
                                        <Link
                                            href={`/workspaces/${data.uuid}/${board.id}`}
                                            key={board.id}
                                            className="group flex min-w-0 flex-col gap-4 rounded-[5px] border-2 border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                                        >
                                            {/* Board title */}
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <h3 className="truncate text-sm font-semibold text-gray-800 group-hover:text-blue-600">
                                                        {board.name}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-100" />

                                            {/* Board statistics */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-gray-500">
                                                    <span className="text-xs">
                                                        {board._count.cycle} Cycles
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5 text-gray-500">
                                                    <span className="text-xs">
                                                        {board._count.tasks} Tasks
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-4 py-16 text-center">
                                    <div className="flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-400"></div>
                                    <h3 className="mt-4 text-sm font-semibold text-gray-700">
                                        No boards yet
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Create a board to start organizing your work.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full overflow-hidden">
                            <BoxChat />
                        </div>
                    )}
                </div>
            </div>

            {/* Member sidebar */}
            <aside className="h-full w-64 shrink-0 overflow-hidden border-l border-gray-200 bg-white xl:w-72">
                <BoxMember members={data.members} workspaceUuid={data.uuid} />
            </aside>
        </div>
    );
};

export default PageClient;
