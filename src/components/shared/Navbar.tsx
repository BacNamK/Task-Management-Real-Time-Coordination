'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Home', href: '/home', id: 1 },
    { label: 'Workspace', href: '/workspace', id: 2 },
    // { label: 'Notifications', href: '/notifications', id: 3 },
    // { label: 'Settings', href: '/settings', id: 4 },
];

type NavbarProps = {
    userName: string;
    userImage: string;
};

export const Navbar = ({ userName, userImage }: NavbarProps) => {
    const pathname = usePathname();

    const isActiveLink = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const safeImage =
        userImage && userImage.trim()
            ? userImage
            : 'https://api.dicebear.com/7.x/initials/svg?seed=User';

    return (
        <aside className="flex h-screen w-full flex-col border-r border-zinc-200 bg-white px-5 py-6 shadow-sm">
            <div className="flex items-center gap-3 px-2">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
                        Project
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">TOJECTTA</h2>
                </div>
            </div>

            <hr className="mt-5 h-1 w-full" />

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = isActiveLink(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition ${
                                isActive
                                    ? 'bg-zinc-900 text-white'
                                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                            }`}
                        >
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-6 space-y-3 border-t border-zinc-200 pt-5">
                <div className="flex items-center gap-3 rounded-xl border border-zinc-200 p-2">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
                        <Image
                            src={safeImage}
                            alt={userName || 'User'}
                            width={40}
                            height={40}
                            unoptimized
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-900">{userName || 'User'}</p>
                        <p className="text-xs text-zinc-500">Workspace</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
