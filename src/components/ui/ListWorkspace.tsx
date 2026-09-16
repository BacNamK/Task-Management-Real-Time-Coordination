import { onwType, userType } from '@/src/types/listWorkspace';

import Image from 'next/image';
const ListWorkspace = ({ workspaces }: { workspaces: any }) => {
    const own = workspaces.yourOwn;
    const mem = workspaces.yourMem;

    return (
        <div className="h-full">
            <div className="p-2 shadow">
                <h2 className="">You are Own</h2>
                {own?.length == 0 ? (
                    <p>No thing here</p>
                ) : (
                    <div className="w-full grid grid-cols-2 gap-4 p-2">
                        {own?.map((items: onwType) => (
                            <div
                                key={items.workspace.id}
                                className="w-full h-full shadow p-4 rounded-xl"
                            >
                                <h3 className="text-xl">{items.workspace.name}</h3>
                                <p>Date : 9/14/2026</p>
                                <div className="flex gap-2">
                                    Member{' '}
                                    {items.user.map((user: userType, index) => (
                                        <div key={index}>
                                            <Image
                                                alt={user.name}
                                                src={user.image ?? ''}
                                                width={30}
                                                height={30}
                                                className="rounded-full"
                                            ></Image>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="p-2 shadow">
                <h2 className="text-2xl">You are Member</h2>
                {mem?.length == 0 ? (
                    <p>No thing here</p>
                ) : (
                    <div className="w-full grid grid-cols-2 p-2">
                        {mem?.map((items: onwType) => (
                            <div key={items.workspace.id}>{items.workspace.name}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListWorkspace;
