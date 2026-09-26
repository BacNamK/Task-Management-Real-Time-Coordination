'use client';

import { BookOpen, Box, ChevronRight, HomeIcon, PenIcon, PiIcon, Settings } from 'lucide-react';
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
} from '../../../components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

export function AppSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center justify-between">
                    <SidebarMenuButton
                        tooltip="TOJECT"
                        className="group-data-[collapsible=icon]:hidden"
                    >
                        <span className="font-bold ">TOJECT</span>
                    </SidebarMenuButton>

                    <SidebarTrigger />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu className="w-full grid gap-y-1">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Home"
                                isActive={pathname === '/home'}
                                onClick={() => router.push('/home')}
                            >
                                <HomeIcon />
                                <span>Home</span>
                            </SidebarMenuButton>

                            {/* submenu */}
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Workspace"
                                isActive={pathname === '/workspaces'}
                                onClick={() => router.push('/workspaces')}
                            >
                                <Box />
                                <span>Workspace</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="Tài liệu">
                                <BookOpen />
                                <div className="w-full flex items-center justify-between">
                                    <span className="block">Tài liệu</span>
                                    <ChevronRight />
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="Cài đặt">
                                <Settings />
                                <div className="w-full flex items-center justify-between">
                                    <span className="block">Cài đặt</span>
                                    <ChevronRight />
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>{/* User */}</SidebarFooter>
        </Sidebar>
    );
}
