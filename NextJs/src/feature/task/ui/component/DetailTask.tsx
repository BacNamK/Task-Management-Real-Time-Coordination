import {
    CalendarDays,
    CircleDot,
    Clock3,
    MessageCircle,
    Paperclip,
    Plus,
    Tag,
    UsersRound,
    X,
} from 'lucide-react';
import type { Task } from '../../service/task.type';
import Image from 'next/image';

const formatLocalDateTime = (value: string | Date | null | undefined) => {
    if (!value) return null;

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const getInitials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('') || '?';

const DetailTask = ({ task, close }: { task: Task; close: () => void }) => {
    const createdAt = formatLocalDateTime(task.createdAt);
    const dueDate = formatLocalDateTime(task.dueDate);

    return (
        <div className="fixed inset-0 z-50 bg-black/30">
            <button
                aria-label="Close task details"
                className="absolute inset-0 size-full cursor-default"
                onClick={close}
                type="button"
            />
            <section
                aria-labelledby="task-detail-title"
                aria-modal="true"
                className="absolute inset-y-0 right-0 m-2 flex w-[calc(100%-1rem)] flex-col rounded-2xl bg-white shadow-2xl shadow-slate-950/20 sm:w-1/2"
                role="dialog"
            >
                <header className="flex items-start justify-between gap-4  px-6 py-5 sm:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="min-w-0">
                            <h2
                                className="mt-1 wrap-break-word text-lg font-semibold leading-snug text-slate-900"
                                id="task-detail-title"
                            >
                                {task.title}
                            </h2>
                        </div>
                    </div>
                    <button
                        aria-label="Close"
                        className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={close}
                        type="button"
                    >
                        <X aria-hidden="true" size={19} />
                    </button>
                </header>

                <div className="grid gap-y-6 pl-10 pr-10">
                    <section className="w-full">
                        <div className="flex items-center w-full">
                            <div className="w-1/3">
                                <div className="flex gap-2 p-1">
                                    <CalendarDays
                                        aria-hidden="true"
                                        className="shrink-0 text-slate-400"
                                        size={17}
                                    />
                                    <p className="text-xs font-medium text-slate-500">Created</p>
                                </div>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {createdAt ?? 'Unknown date'}
                                </p>
                            </div>
                            <div className="w-1/3 justify-items-center">
                                <div className="flex gap-2 p-1">
                                    <Clock3
                                        aria-hidden="true"
                                        className="shrink-0 text-slate-400"
                                        size={17}
                                    />
                                    <p className="text-xs font-medium text-slate-500">Due date</p>
                                </div>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {dueDate ?? 'No due date'}
                                </p>
                            </div>
                            <div className="w-1/3 flex justify-end p-1 text-sm">
                                {task.createdAt && task.createdAt && task.dueDate ? (
                                    <span>
                                        {Math.ceil(
                                            (new Date(task.dueDate).getTime() -
                                                new Date(task.createdAt).getTime()) /
                                                (1000 * 60 * 60 * 24)
                                        )}{' '}
                                        days left
                                    </span>
                                ) : (
                                    '- day left'
                                )}
                            </div>
                        </div>
                    </section>

                    <div className="w-full border"></div>

                    <section className="flex xl:gap-30 gap-10 mt-2">
                        <div className=" flex items-center gap-2 text-slate-500">
                            <UsersRound aria-hidden="true" className="" size={17} />
                            <h3 className="text-xs font-semibold ">Assignees</h3>
                        </div>
                        {task.assigneeds.length > 0 && (
                            <ul className="space-y-2">
                                {task.assigneeds.map(({ id, user }) => (
                                    <li className="flex items-center gap-3" key={id}>
                                        {user.avatar ? (
                                            <Image
                                                src={user.avatar}
                                                width={28}
                                                height={28}
                                                alt={user.name}
                                                className="size-7 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="flex size-7 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-semibold text-indigo-700">
                                                {getInitials(user.name)}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <div className="flex gap-2 text-slate-500">
                        <Tag size={17} />
                        <span className="text-xs font-semibold">Tags</span>
                    </div>

                    <div className="flex gap-2 text-slate-500">
                        <CircleDot size={17} />
                        <span className="text-xs font-semibold">Confirm status</span>
                    </div>

                    <div>
                        <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                            {task.description?.trim() || 'No description has been added.'}
                        </p>
                    </div>

                    <div>
                        <header className="flex text-xs font-semibold gap-2 items-center text-slate-500">
                            <Paperclip size={17} />
                            <span>Attachment</span>
                        </header>
                        <div className="h-15 w-full content-center mt-2 p-2">
                            <div className="size-13 bg-gray-200 justify-items-center content-center rounded-sm">
                                <Plus size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="text-xs font-semibold min-h-20 text-slate-500">
                        <div className="flex gap-2 w-full border-b pb-2">
                            <MessageCircle size={17} />
                            <span>Comments</span>
                        </div>
                        <div className="h-full text-center content-center">........</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DetailTask;
