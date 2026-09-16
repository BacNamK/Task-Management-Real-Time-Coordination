'use client';

import { FormCreateWorkspace } from '@/src/components/forms/createWorkspace';
import ListWorkspace from '@/src/components/ui/ListWorkspace';
import { workspaceOwn } from '@/src/server/actions/workspace.action';
import { workspaceRp } from '@/src/types/listWorkspace';
import { useEffect, useState } from 'react';

const Page = () => {
    const [workspaces, setWorkspaces] = useState<any>([]);

    useEffect(() => {
        const fetchWorkspaces = async () => {
            const result = await workspaceOwn();
            console.log(result);
            if (result) setWorkspaces(result);
        };
        fetchWorkspaces();
    }, []);

    return (
        <div className="w-full h-full">
            <FormCreateWorkspace
                onCreate={(workspace) =>
                    setWorkspaces((pre: workspaceRp) => ({
                        ...pre,
                        yourOwn: [{ workspace, user: [] }, ...pre.yourOwn],
                    }))
                }
            />
            <ListWorkspace workspaces={workspaces} />
        </div>
    );
};

export default Page;
