import Link from 'next/link';
import { ArrowRight, CheckCircle2, Layers3, UsersRound } from 'lucide-react';

export default function Home() {
    return (
        <main className="relative flex min-h-full w-full items-center justify-center overflow-hidden bg-slate-50 px-5 py-12">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(99,102,241,0.12),transparent_70%)]"
            />
            <section className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-12">
                <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Layers3 aria-hidden="true" size={23} />
                </div>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                    Toject
                </p>
                <h1 className="mt-2 max-w-xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    A clearer way to move project forward.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                    Plan work, keep tasks moving, and collaborate with your team in one place.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                        href="/projects"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Go to projects
                        <ArrowRight aria-hidden="true" size={16} />
                    </Link>
                    <Link
                        href="/home"
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        View dashboard
                    </Link>
                </div>
                <div className="mt-10 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-3">
                    {[
                        { icon: Layers3, label: 'Organize project' },
                        { icon: CheckCircle2, label: 'Track tasks' },
                        { icon: UsersRound, label: 'Collaborate' },
                    ].map(({ icon: Icon, label }) => (
                        <div className="flex items-center gap-2 text-sm text-slate-600" key={label}>
                            <Icon aria-hidden="true" className="text-indigo-500" size={17} />
                            {label}
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
