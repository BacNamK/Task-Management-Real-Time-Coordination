'use client';

import { Item } from './Item';
import { onwType } from '@/src/types/listWorkspace.Type';

const ListWorkspace = ({ workspaces }: { workspaces: any }) => {
    const own = workspaces.yourOwn;
    const mem = workspaces.yourMem;

    return (
        <div className="h-full justify-items-center">
            <div className="w-full p-2 justify-items-center">
                {own?.length == 0 ? (
                    <p>No thing here</p>
                ) : (
                    <div className="w-[80%] grid grid-cols-2 gap-4 p-2">
                        {own?.map((items: onwType, index: number) => (
                            <Item
                                item={{ workspace: items.workspace, user: items.user }}
                                key={index}
                            />
                        ))}
                    </div>
                )}
            </div>
            <hr className="w-[80%] my-4 opacity-20" />
            <div className="w-full p-2">
                {mem?.length == 0 ? (
                    <p>No thing here</p>
                ) : (
                    <div className="grid grid-cols-2 justify-items-start gap-4 p-2">
                        {mem?.map((items: onwType, index: number) => (
                            <Item
                                item={{ workspace: items.workspace, user: items.user }}
                                key={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListWorkspace;
