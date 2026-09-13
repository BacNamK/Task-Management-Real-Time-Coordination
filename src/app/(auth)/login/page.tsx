// app/login/page.tsx
import { auth, signIn } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';

import prisma from '@/src/lib/prisma';
import googleIcon from '@/public/google.png';

export default async function LoginPage() {
    const session = await auth();

    // Nếu đã đăng nhập, hiển thị thông tin User
    if (session?.user) {
        const check = await prisma.user.findUnique({
            where: { name: session.user.name || undefined },
            select: { name: true },
        });

        if (check == null) {
            const user = await prisma.user.create({
                data: {
                    name: session.user.name ?? '',
                    email: session.user.email ?? '',
                    password_hash: '',
                },
            });

            await prisma.roleUser.create({
                data: {
                    userId: user.id,
                    roleId: 1,
                },
            });
        }

        redirect('/home');
    }

    // Nếu chưa đăng nhập, hiển thị nút Đăng nhập bằng Google
    return (
        <div className="min-h-screen w-full relative bg-black items-center flex">
              {/* X Organizations Black Background with Top Glow */} {' '}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background:
                        'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000',
                }}
            />
            <div className="w-full absolute z-10 justify-items-center">
                <form
                    action={async () => {
                        'use server';
                        await signIn('google'); // Chỉ định rõ provider là "google"
                    }}
                    className="w-30 flex justify-center items-center gap-2 border p-2 rounded-xl bg-white shadow text-black"
                >
                    <button type="submit" className="text-xl flex items-center">
                        <Image src={googleIcon} alt="" className="size-5 mb-1" />
                        oogle
                    </button>
                </form>
            </div>
        </div>
    );
}
