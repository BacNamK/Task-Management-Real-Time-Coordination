import type { Metadata } from 'next';

import './globals.css';

// import { projectStateSync } from '../components/shared/projectStateSync';
import { Geist } from 'next/font/google';
import { cn } from '../lib/utils';
import { SidebarProvider } from '../components/ui/sidebar';
import { AppSidebar } from '../components/shared/AppSidebar';
import { SidebarController } from '../components/shared/SidebarControll';
import { auth } from '../lib/auth/auth';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
    title: {
        default: 'Toject',
        template: '%s | Toject',
    },
    description: 'Organize project and collaborate with your team.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const user = session?.user;

    return (
        <html lang="en" className={cn('font-sans', geist.variable)}>
            <body className="min-h-screen w-full bg-slate-50 text-slate-900">
                <SidebarProvider>
                    <SidebarController />
                    <AppSidebar user={user} />
                    <main className="h-screen min-w-0 w-full overflow-hidden">{children}</main>
                </SidebarProvider>
            </body>
        </html>
    );
}
