'use client';

import { Item } from './Item';
import { onwType } from '@/src/types/listWorkspace.Type';

const ListWorkspace = ({ workspaces }: { workspaces: any }) => {
    const own = workspaces.yourOwn;
    const mem = workspaces.yourMem;

    return (
        <div className="w-full h-screen">
            <div className="w-full h-1/3">
                {own?.length == 0 ? (
                    <p className="text-sm text-gray-500 text-center p-2">No thing here</p>
                ) : (
                    <div className="w-full justify-center grid grid-cols-3 gap-4 mt-2">
                        {own?.map((items: onwType, index: number) => (
                            <Item
                                item={{ workspace: items.workspace, owner: items.owner }}
                                key={index}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="w-full h-auto">
                <h3 className="text-md bg-gray-200 p-3 shadow-md w-full">You Member</h3>
                {mem?.length == 0 ? (
                    <p className="text-sm text-gray-500 text-center p-2">No thing here</p>
                ) : (
                    <div className="grid grid-cols-3 justify-items-start gap-4 pt-4">
                        {mem?.map((items: onwType, index: number) => (
                            <Item
                                item={{ workspace: items.workspace, owner: items.owner }}
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
