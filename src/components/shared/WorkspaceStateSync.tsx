'use client';

import { useItemsStore } from '@/src/hooks/workspaceHook';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const WorkspaceStateSync = () => {
    const pathname = usePathname();

    const uuid = pathname.split('/').pop();

    const workspace = useItemsStore((state) => state.workspace);
    const setWorkspace = useItemsStore((state) => state.setWorkspace);
    const reset = useItemsStore((state) => state.reset);

    useEffect(() => {
        // Ra khỏi workspace thì reset storage
        if (!pathname.startsWith('/workspaces')) {
            reset();
        }

        if (uuid && uuid !== workspace) {
            setWorkspace(uuid);
        }
    }, [pathname, uuid, workspace, setWorkspace, reset]);

    return null;
};
