'use client';

import { useState } from 'react';
import { useItemsStore } from '../../../../hooks/workspaceHook';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Columns3, PanelsTopLeft, UsersRound } from 'lucide-react';
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
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const handleItemClick = (item: projectItem) => {
        setSelectedItem(item);
    };
    const ownerAvatar = item.owner?.avatar ?? item.owner?.image;

    return (
        <div className="Item-project group relative block h-auto w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <Link
                href={`/projects/${item.project.uuid}`}
                onClick={() => handleItemClick(item)}
                aria-label={`Open project ${item.project.name}`}
                className="absolute inset-0 z-0  rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            />
            <div className="pointer-events-none relative z-10 flex flex-col gap-2">
                {/* Header */}
                <div className="flex w-full items-center justify-between gap-3">
                    <div className="flex gap-2 items-center justify-center rounded-xl">
                        <div className="size-10 justify-items-center content-center bg-indigo-50 text-indigo-500 rounded-lg">
                            <PanelsTopLeft aria-hidden="true" size={22} />
                        </div>
                        <h3 className="truncate text-base font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                            {item.project.name}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarDays aria-hidden="true" size={14} />
                        {new Date(item.project.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </div>
                </div>

                {item.project.description?.trim() && (
                    <div className="w-full rounded-xl p-2 text-sm text-slate-600">
                        <p
                            className={
                                isDescriptionExpanded
                                    ? 'whitespace-pre-wrap'
                                    : 'line-clamp-6 whitespace-pre-wrap'
                            }
                        >
                            {item.project.description}
                        </p>
                        <button
                            type="button"
                            aria-expanded={isDescriptionExpanded}
                            onClick={() => setIsDescriptionExpanded((expanded) => !expanded)}
                            className="pointer-events-auto mt-1 text-sm font-medium hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {isDescriptionExpanded ? 'Read less' : 'Read more...'}
                        </button>
                    </div>
                )}

                {/* Footer */}
                <div className="flex flex-wrap items-end justify-between gap-4 p-1">
                    {/* Owner */}
                    <div className="flex min-w-0 items-center gap-2.5">
                        {ownerAvatar ? (
                            <Image
                                src={ownerAvatar}
                                alt={item.owner.name ?? 'Owner'}
                                width={28}
                                height={28}
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
            </div>
        </div>
    );
};
