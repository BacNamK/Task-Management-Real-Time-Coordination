import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, UsersRound } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="h-full w-full overflow-y-auto bg-slate-50/60">
            <main className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-8 p-5 sm:p-8">
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)] lg:items-center">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                                Your project
                            </p>
                            <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                                Make progress, together.
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                                Keep project organized, make work visible, and help your team stay
                                in sync.
                            </p>
                            <Link
                                href="/projects"
                                className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Open project
                                <ArrowRight aria-hidden="true" size={16} />
                            </Link>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                            {[
                                {
                                    icon: BriefcaseBusiness,
                                    title: 'project',
                                    detail: 'Keep work in one place',
                                },
                                {
                                    icon: CheckCircle2,
                                    title: 'Tasks',
                                    detail: 'Track each next step',
                                },
                                {
                                    icon: UsersRound,
                                    title: 'Team',
                                    detail: 'Work better together',
                                },
                            ].map(({ icon: Icon, title, detail }) => (
                                <div
                                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                                    key={title}
                                >
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                                        <Icon aria-hidden="true" size={17} />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-medium text-slate-800">
                                            {title}
                                        </h2>
                                        <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <BriefcaseBusiness aria-hidden="true" size={18} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Pick up where your team works
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                Visit your project to open a board, review tasks, or connect with
                                teammates.
                            </p>
                            <Link
                                href="/projects"
                                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                            >
                                Browse projects
                                <ArrowRight aria-hidden="true" size={15} />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
