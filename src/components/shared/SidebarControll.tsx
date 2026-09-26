'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';

export function SidebarController() {
    const pathname = usePathname();
    const { setOpen } = useSidebar();

    const uuid = pathname.split('/')[2];

    useEffect(() => {
        if (pathname.startsWith('/workspaces/')) {
            if (uuid) {
                setOpen(false);
            }
        }
    }, [pathname, setOpen, uuid]);

    return null;
}
