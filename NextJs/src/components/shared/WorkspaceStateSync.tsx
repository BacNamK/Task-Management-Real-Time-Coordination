'use client';

import { useItemsStore } from '../../hooks/projectHook';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const projectStateSync = () => {
    const pathname = usePathname();

    const uuid = pathname.split('/').pop();

    const project = useItemsStore((state) => state.project);
    const setproject = useItemsStore((state) => state.setproject);
    const reset = useItemsStore((state) => state.reset);

    useEffect(() => {
        // Ra khỏi project thì reset storage
        if (!pathname.startsWith('/projects')) {
            reset();
        }

        if (uuid && uuid !== project) {
            setproject(uuid);
        }
    }, [pathname, uuid, project, setproject, reset]);

    return null;
};
