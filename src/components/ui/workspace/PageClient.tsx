'use client';

import { FormCreateWorkspace } from '@/src/components/forms/CreateWorkspace';
import ListLayout from '@/src/components/ui/workspace/ListLayout';
import { workspaceRp } from '@/src/types/listWorkspace.Type';
import { useState } from 'react';

type Props = {
    initialWorkspaces: workspaceRp;
};

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
            <ListLayout workspaces={workspaces} />
        </div>
    );
};

export default WorkspacePageClient;
