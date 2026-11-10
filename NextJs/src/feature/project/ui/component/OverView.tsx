import Link from 'next/link';
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, Columns3, UsersRound } from 'lucide-react';
import type { projectDetail } from '../../sevice/project.type';

const Overview = ({ data }: { data: projectDetail }) => {
    const boards = data.boards ?? [];
    const members = data.members ?? [];
    const createdAt = data.createdAt
        ? new Date(data.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : 'Unknown date';

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-5">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <header className="flex items-start gap-4 px-6 py-6 sm:px-8">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <BriefcaseBusiness aria-hidden="true" size={22} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Project overview
                        </p>
                        <h1 className="mt-1 wrap-break-word text-xl font-semibold text-slate-900">
                            {data.name}
                        </h1>
                    </div>
                </header>

                <div className="mx-6 border-t border-slate-100 sm:mx-8" />

                <dl className="grid gap-5 px-6 py-6 sm:grid-cols-3 sm:px-8">
                    <div className="flex items-start gap-3">
                        <CalendarDays
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-slate-400"
                            size={18}
                        />
                        <div>
                            <dt className="text-xs font-medium text-slate-500">Created</dt>
                            <dd className="mt-1 text-sm font-medium text-slate-800">{createdAt}</dd>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Columns3
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-slate-400"
                            size={18}
                        />
                        <div>
                            <dt className="text-xs font-medium text-slate-500">Boards</dt>
                            <dd className="mt-1 text-sm font-medium text-slate-800">
                                {boards.length}
                            </dd>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <UsersRound
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-slate-400"
                            size={18}
                        />
                        <div>
                            <dt className="text-xs font-medium text-slate-500">Members</dt>
                            <dd className="mt-1 text-sm font-medium text-slate-800">
                                {members.length}
                            </dd>
                        </div>
                    </div>
                </dl>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-800">Boards</h2>
                            <p className="mt-1 text-xs text-slate-500">Boards in this project</p>
                        </div>
                        <Columns3 aria-hidden="true" className="text-slate-400" size={18} />
                    </div>
                    {boards.length > 0 ? (
                        <ul className="divide-y divide-slate-100">
                            {boards.slice(0, 4).map((board) => (
                                <li key={board.id}>
                                    <Link
                                        href={`/projects/${data.uuid}/${board.id}`}
                                        className="group flex items-center justify-between gap-3 py-3"
                                    >
                                        <span className="truncate text-sm font-medium text-slate-700 transition group-hover:text-indigo-600">
                                            {board.title}
                                        </span>
                                        <span className="flex shrink-0 items-center gap-2 text-xs text-slate-500">
                                            {board._count?.tasks ?? 0} tasks
                                            <ArrowUpRight
                                                aria-hidden="true"
                                                className="text-slate-400 transition group-hover:text-indigo-600"
                                                size={15}
                                            />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                            No boards yet. Create a board to start organizing your work.
                        </p>
                    )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-800">Members</h2>
                            <p className="mt-1 text-xs text-slate-500">
                                People collaborating on this project
                            </p>
                        </div>
                        <UsersRound aria-hidden="true" className="text-slate-400" size={18} />
                    </div>
                    {members.length > 0 ? (
                        <ul className="space-y-3">
                            {members.slice(0, 5).map((member, index) => {
                                const name = member.user?.name ?? member.name ?? 'Member';
                                return (
                                    <li
                                        className="flex items-center gap-3"
                                        key={member.id ?? member.user?.id ?? index}
                                    >
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
                                            {name
                                                .trim()
                                                .split(/\s+/)
                                                .slice(0, 2)
                                                .map((part: string) => part[0])
                                                .join('')
                                                .toUpperCase()}
                                        </span>
                                        <span className="min-w-0 truncate text-sm font-medium text-slate-700">
                                            {name}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                            No members in this project yet.
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Overview;
