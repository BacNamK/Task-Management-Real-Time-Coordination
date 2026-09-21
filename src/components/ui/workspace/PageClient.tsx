'use client';

import { FormCreateWorkspace } from '@/src/components/forms/CreateWorkspace';
import ListLayout from '@/src/components/ui/workspace/ListLayout';
import { workspaceRp } from '@/src/types/listWorkspace.Type';
import { createContext } from 'react';

import { useState } from 'react';

type Props = {
    initialWorkspaces: workspaceRp;
};

export const WorkspaceContext = createContext<workspaceRp>({} as workspaceRp);

const WorkspacePageClient = ({ initialWorkspaces }: Props) => {
    const [workspaces, setWorkspaces] = useState<workspaceRp>(initialWorkspaces);

    return (
        <div className="w-full h-full">
            <FormCreateWorkspace
                onCreate={(workspace) =>
                    setWorkspaces((prev) => ({
                        ...prev,
                        yourOwn: [{ workspace, user: [] }, ...prev.yourOwn],
                    }))
                }
            />
            <WorkspaceContext.Provider value={workspaces}>
                <ListLayout workspaces={workspaces} />
            </WorkspaceContext.Provider>
        </div>
    );
};

export default WorkspacePageClient;
