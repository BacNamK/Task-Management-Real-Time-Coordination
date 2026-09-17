import { userType } from '@/src/types/listWorkspace.Type';
import Image from 'next/image';
import Link from 'next/link';

type item =  {
    workspace: any;
    user: userType[];
}

export const Item = ({ item }: { item: item }) => {
    console.log(item);
    return (
        <Link
            href={{
                pathname: `/workspace/${item.workspace.slug}`,
                query: { uuid: item.workspace.uuid },
            }}
            className="block w-full h-full p-4 rounded-xl shadow border border-gray-300 hover:bg-gray-50 transition"
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
