'use client';

import {
    BookOpen,
    Box,
    BriefcaseBusiness,
    ChevronRight,
    HomeIcon,
    Settings,
    Workflow,
    WorkflowIcon,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from '../ui/sidebar';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

type SidebarUser = {
    name?: string | null;
    image?: string | null;
};

export function AppSidebar({ user }: { user?: SidebarUser }) {
    const router = useRouter();
    const pathname = usePathname();

    if (pathname === '/login') return null;

    return (
        <Sidebar collapsible="icon" className="bg-white text-slate-500 text-xs font-medium">
            <SidebarHeader>
                <div className="flex items-center justify-between">
                    <SidebarMenuButton
                        tooltip="TOJECT"
                        className="h-10 group-data-[collapsible=icon]:hidden"
                    >
                        <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <BriefcaseBusiness aria-hidden="true" size={16} />
                        </span>
                        <span className="font-semibold tracking-wide">TOJECT</span>
                    </SidebarMenuButton>

                    <SidebarTrigger />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu className="grid w-full gap-y-1">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="My Tasks"
                                isActive={pathname === '/mytasks'}
                                onClick={() => router.push('/mytasks')}
                            >
                                <WorkflowIcon />
                                <span>My Tasks</span>
                            </SidebarMenuButton>

                            {/* submenu */}
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="projects"
                                isActive={
                                    pathname === '/projects' || pathname.startsWith('/projects/')
                                }
                                onClick={() => router.push('/projects')}
                            >
                                <Box />
                                <span>Projects</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="Documnet">
                                <BookOpen />
                                <div className="w-full flex items-center justify-between">
                                    <span className="block">Document</span>
                                    <ChevronRight />
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="Setting">
                                <Settings />
                                <div className="w-full flex items-center justify-between">
                                    <span className="block">Settings</span>
                                    <ChevronRight />
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2">
                    {user?.image ? (
                        <Image
                            src={user.image}
                            alt={user.name ?? 'User profile'}
                            width={32}
                            height={32}
                            unoptimized
                            className="size-8 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                            {user?.name?.charAt(0).toUpperCase() ?? '?'}
                        </div>
                    )}
                    <span className="truncate text-sm font-medium text-slate-700 group-data-[collapsible=icon]:hidden">
                        {user?.name || 'Account'}
                    </span>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
