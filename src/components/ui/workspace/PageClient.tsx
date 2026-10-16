'use client';

import { FormCreateWorkspace } from '../../forms/CreateWorkspace';
import ListLayout from './ListLayout';
import { createContext } from 'react';

import { useState } from 'react';

type Props = {
    initialWorkspaces: any;
};

export const WorkspaceContext = createContext<any>({} as any);

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
