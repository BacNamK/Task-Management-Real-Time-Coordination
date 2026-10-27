'use client';

import { useItemsStore } from '../../../../hooks/projectHook';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Columns3, UsersRound } from 'lucide-react';
import type { project } from '../../sevice/project.type';

type projectItem = {
    project: project;
    owner?: {
        name?: string | null;
        avatar?: string | null;
        image?: string | null;
    } | null;
};

export const Item = ({ item }: { item: projectItem }) => {
    // Lưu danh sách người có trong projectMember
    const setSelectedItem = useItemsStore((state) => state.setproject);

    const handleItemClick = (item: projectItem) => {
        setSelectedItem(item);
    };
    const ownerAvatar = item.owner?.avatar ?? item.owner?.image;

    return (
        <Link
            href={`/projects/${item.project.uuid}`}
            onClick={() => handleItemClick(item)}
            className="Item-project group block w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
            <div className="flex min-h-36 flex-col justify-between gap-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Columns3 aria-hidden="true" size={18} />
                        </div>
                        <h3 className="truncate text-base font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                            {item.project.name}
                        </h3>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100" />

                {/* Footer */}
                <div className="flex flex-wrap items-end justify-between gap-4">
                    {/* Owner */}
                    <div className="flex min-w-0 items-center gap-2.5">
                        {ownerAvatar ? (
                            <Image
                                src={ownerAvatar}
                                alt={item.owner.name ?? 'Owner'}
                                width={32}
                                height={32}
                                className="size-9 shrink-0 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                                {item.owner?.name?.charAt(0).toUpperCase() ?? '?'}
                            </div>
                        )}

                        <div className="min-w-0">
                            <p className="text-xs text-slate-400">Owner</p>
                            <p className="truncate text-sm font-medium text-slate-700">
                                {item.owner?.name ?? 'Unknown'}
                            </p>
                        </div>
                    </div>

                    {/* project stats */}
                    <div className="flex shrink-0 items-center gap-4">
                        <div className="flex items-center gap-1.5 text-slate-500" title="Members">
                            <UsersRound aria-hidden="true" size={15} />
                            <span className="text-xs font-medium">
                                {item.project._count?.members ?? 0}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-500" title="Boards">
                            <Columns3 aria-hidden="true" size={15} />
                            <span className="text-xs font-medium">
                                {item.project._count?.boards ?? 0}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <CalendarDays aria-hidden="true" size={14} />
                    Created{' '}
                    {new Date(item.project.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </div>
            </div>
        </Link>
    );
};
