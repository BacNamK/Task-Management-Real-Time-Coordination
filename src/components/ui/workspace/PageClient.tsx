'use client';

import { FormCreateWorkspace } from '@/src/components/forms/CreateWorkspace';
import ListLayout from '@/src/components/ui/workspace/ListLayout';
import { workspaceRp } from '@/src/types/listWorkspace.Type';
import { createContext } from 'react';

import { useState } from 'react';

type Props = {
    initialWorkspaces: any;
};

export const WorkspaceContext = createContext<workspaceRp>({} as workspaceRp);

const WorkspacePageClient = ({ initialWorkspaces }: Props) => {
    const [workspaces, setWorkspaces] = useState<any>(initialWorkspaces);

    return (
        <div className="w-full h-screen p-4">
            <FormCreateWorkspace
                onCreate={(workspace) =>
                    setWorkspaces((prev: any) => ({
                        ...prev,
                        yourOwn: [{ workspace, owner: {} }, ...prev.yourOwn],
                    }))
                }
            />
            <ListLayout workspaces={workspaces} />
        </div>
    );
};

export default WorkspacePageClient;
