'use client';

import { useItemsStore } from '@/src/hooks/workspaceHook';
import { userType } from '@/src/types/listWorkspace.Type';
import Image from 'next/image';
import Link from 'next/link';

type item = {
    workspace: any;
    user: userType[];
};

export const Item = ({ item }: { item: item }) => {
    // Lưu danh sách người có trong workspaceMember
    const setSelectedItem = useItemsStore((state) => state.setSelectedItem);

    const handleItemClick = () => {
        setSelectedItem(item);
    };

    return (
        <Link
            onClick={handleItemClick}
            href={{
                pathname: `/workspaces/${item.workspace.uuid}`,
            }}
            className="block w-full h-full p-4 rounded-[5px] shadow border border-gray-300 hover:bg-gray-50 transition"
        >
            <div className="grid gap-y-2">
                <h3 className="text-xl font-bold">{item.workspace.name}</h3>
                <p className="text-sm text-gray-500">
                    {item.workspace.createdAt?.toLocaleDateString() ?? ''}
                </p>
                <div className="flex gap-2">
                    Member{' '}
                    {item.user.map((user: userType, index: number) => (
                        <Image
                            key={index}
                            alt={user.name}
                            src={user.image ?? ''}
                            width={30}
                            height={30}
                            className="rounded-full"
                        />
                    ))}
                </div>
            </div>
        </Link>
    );
};
