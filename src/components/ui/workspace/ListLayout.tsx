'use client';

import { Item } from './Item';
import { onwType } from '@/src/types/listWorkspace.Type';

const ListWorkspace = ({ workspaces }: { workspaces: any }) => {
    const own = workspaces.yourOwn;
    const mem = workspaces.yourMem;

    return (
        <div className="h-full grid gap-y-4">
            <div className="w-full p-2">
                {own?.length == 0 ? (
                    <p className="text-sm text-gray-500 text-center p-2">No thing here</p>
                ) : (
                    <div className="w-full justify-center grid grid-cols-2 gap-4 p-2">
                        {own?.map((items: onwType, index: number) => (
                            <Item
                                item={{ workspace: items.workspace, user: items.user }}
                                key={index}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="w-full">
                <h3 className="text-md border-b-2 border-orange-300 ml-5 p-1 inline-block">
                    You Member
                </h3>
                {mem?.length == 0 ? (
                    <p className="text-sm text-gray-500 text-center p-2">No thing here</p>
                ) : (
                    <div className="grid grid-cols-2 justify-items-start gap-4 p-4">
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
