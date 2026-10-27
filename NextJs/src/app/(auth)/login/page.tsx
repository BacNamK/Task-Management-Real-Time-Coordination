// app/login/page.tsx
import { auth, signIn } from '../../../lib/auth/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';

import googleIcon from '../../../../public/google.png';
export default async function LoginPage() {
    const session = await auth();

    // Nếu đã đăng nhập, hiển thị thông tin User
    if (session?.user) {
        redirect('/home');
    }

    // Nếu chưa đăng nhập, hiển thị nút Đăng nhập bằng Google
    return (
        <main className="relative flex min-h-full w-full items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(99,102,241,0.12),transparent_70%)]"
            />
            <section className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <span className="text-lg font-bold" aria-hidden="true">
                        T
                    </span>
                </div>
                <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                    Toject
                </p>
                <h1 className="mt-2 text-center text-2xl font-semibold tracking-tight text-slate-900">
                    Welcome back
                </h1>
                <p className="mt-2 text-center text-sm leading-6 text-slate-500">
                    Sign in to manage your project and collaborate with your team.
                </p>
                <form
                    action={async () => {
                        'use server';
                        await signIn('google'); // Chỉ định rõ provider là "google"
                    }}
                    className="mt-8"
                >
                    <button
                        type="submit"
                        className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <Image src={googleIcon} alt="" className="size-5" />
                        Continue with Google
                    </button>
                </form>
            </section>
        </main>
    );
}
