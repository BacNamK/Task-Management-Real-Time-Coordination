'use client';

import { useItemsStore } from '@/src/hooks/workspaceHook';
import Image from 'next/image';
import Link from 'next/link';

type item = {
    workspace: any;
    owner: any;
};

export const Item = ({ item }: { item: item }) => {
    // Lưu danh sách người có trong workspaceMember
    const setSelectedItem = useItemsStore((state) => state.setWorkspace);

    const handleItemClick = (item: item) => {
        setSelectedItem(item);
    };

    return (
        <Link
            href={`/workspaces/${item.workspace.uuid}`}
            onClick={() => handleItemClick(item)}
            className="group block w-full rounded-xl border-2 border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
        >
            <div className="flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                            {item.workspace.name}
                        </h3>
                    </div>

                    <div className="flex shrink-0 items-center justify-center">
                        <p className="mt-1 text-xs text-gray-400">
                            Created {item.workspace.createdAt?.toLocaleDateString() ?? ''}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Footer */}
                <div className="flex items-center justify-between gap-3">
                    {/* Owner */}
                    <div className="flex min-w-0 items-center gap-2">
                        {item.owner?.image ? (
                            <Image
                                src={item.owner.image}
                                alt={item.owner.name ?? 'Owner'}
                                width={32}
                                height={32}
                                className="size-8 shrink-0 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                                {item.owner?.name?.charAt(0).toUpperCase() ?? '?'}
                            </div>
                        )}

                        <div className="min-w-0">
                            <p className="text-xs text-gray-400">Owner</p>
                            <p className="truncate text-sm font-medium text-gray-700">
                                {item.owner?.name ?? 'Unknown'}
                            </p>
                        </div>
                    </div>

                    {/* Workspace stats */}
                    <div className="flex shrink-0 items-center gap-3">
                        <div className="flex items-center gap-1.5 text-gray-500">
                            <span className="text-sm font-medium">
                                {item.workspace._count?.members ?? 0}
                            </span>
                            <span className="hidden text-xs sm:inline">Members</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-gray-500">
                            <span className="text-sm font-medium">
                                {item.workspace._count?.boards ?? 0}
                            </span>
                            <span className="hidden text-xs sm:inline">Boards</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
