'use client';

import Image from 'next/image';
import { useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import { Plus, UsersRound } from 'lucide-react';
import { create } from '../../service/task.action';
import type { projectMember } from '../../../project/sevice/project.type';

type AssigneeOption = {
    id: string;
    name: string;
    avatar: string | null;
};

type Props = {
    users: projectMember[];
    boardId: string;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const Create = ({ users, boardId, setIsOpen }: Props) => {
    const [isOpenBox, setIsOpenBox] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<AssigneeOption[]>([]);
    const [notification, setNotification] = useState({ status: false, message: '' });

    const userOptions = users
        .map(
            (member): AssigneeOption => ({
                id: String(member.user?.id ?? member.id ?? ''),
                name: member.user?.name ?? member.name ?? 'Member',
                avatar: member.user?.image ?? member.avatar ?? null,
            })
        )
        .filter((member) => member.id.length > 0);

    const showNotification = (status: boolean, message: string) => {
        setNotification({ status, message });
        setTimeout(() => setNotification({ status: false, message: '' }), 7000);
    };

    const toggleAssignee = (member: AssigneeOption) => {
        setSelectedUsers((current) =>
            current.some((selected) => selected.id === member.id)
                ? current.filter((selected) => selected.id !== member.id)
                : [...current, member]
        );
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const title = String(formData.get('title') ?? '').trim();

        if (!title) {
            showNotification(false, 'Please enter a task name.');
            return;
        }

        const dueDateValue = String(formData.get('dueDate') ?? '');
        try {
            await create({
                title,
                description: String(formData.get('description') ?? ''),
                dueDate: dueDateValue ? new Date(dueDateValue) : undefined,
                position: 0,
                cycleId: null,
                boardId,
                assigneeds: selectedUsers.map(({ id }) => ({ userId: id })),
            });
            form.reset();
            setSelectedUsers([]);
            showNotification(true, 'Task created successfully.');
        } catch (error) {
            console.error('Failed to create task:', error);
            showNotification(false, 'Could not create task. Please try again.');
        }
    };

    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
            <section
                aria-labelledby="create-task-title"
                aria-modal="true"
                className="relative w-full max-w-2xl overflow-visible rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20"
                role="dialog"
            >
                <header className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-7">
                    <div className="relative flex min-w-0 flex-1 items-center gap-3">
                        <button
                            type="button"
                            aria-expanded={isOpenBox}
                            onClick={() => setIsOpenBox((open) => !open)}
                            className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            <UsersRound aria-hidden="true" size={16} />
                            Assignees
                            <Plus aria-hidden="true" size={15} />
                        </button>

                        <ul className="flex min-w-0 items-center gap-1.5">
                            {selectedUsers.map((member) => (
                                <li key={member.id} title={member.name}>
                                    {member.avatar ? (
                                        <Image
                                            src={member.avatar}
                                            alt={member.name}
                                            width={32}
                                            height={32}
                                            className="size-8 rounded-full object-cover ring-2 ring-white"
                                        />
                                    ) : (
                                        <span className="flex size-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700 ring-2 ring-white">
                                            {member.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {isOpenBox && (
                            <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                                <p className="px-2 py-1 text-xs font-medium text-slate-500">
                                    Select assignees
                                </p>
                                {userOptions.length > 0 ? (
                                    <ul className="mt-1 grid max-h-56 grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2">
                                        {userOptions.map((member) => {
                                            const selected = selectedUsers.some(
                                                (item) => item.id === member.id
                                            );
                                            return (
                                                <li key={member.id}>
                                                    <button
                                                        type="button"
                                                        aria-pressed={selected}
                                                        onClick={() => toggleAssignee(member)}
                                                        className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition ${
                                                            selected
                                                                ? 'bg-indigo-50 text-indigo-700'
                                                                : 'text-slate-700 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        {member.avatar ? (
                                                            <Image
                                                                src={member.avatar}
                                                                alt=""
                                                                width={32}
                                                                height={32}
                                                                className="size-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                                                {member.name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </span>
                                                        )}
                                                        <span className="truncate text-sm">
                                                            {member.name}
                                                        </span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p className="px-2 py-4 text-sm text-slate-500">
                                        No project members available.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        <h2 className="sr-only" id="create-task-title">
                            Create task
                        </h2>
                        <button
                            type="submit"
                            form="create-task-form"
                            disabled={notification.status}
                            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Create task
                        </button>
                    </div>
                </header>

                <form
                    id="create-task-form"
                    onSubmit={handleSubmit}
                    className="space-y-5 p-5 sm:p-7"
                >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label
                                className="mb-2 block text-sm font-medium text-slate-600"
                                htmlFor="task-title"
                            >
                                Task name
                            </label>
                            <input
                                id="task-title"
                                name="title"
                                type="text"
                                required
                                placeholder="Enter task name"
                                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <div>
                            <label
                                className="mb-2 block text-sm font-medium text-slate-600"
                                htmlFor="task-due-date"
                            >
                                Due date
                            </label>
                            <input
                                id="task-due-date"
                                name="dueDate"
                                type="date"
                                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            className="mb-2 block text-sm font-medium text-slate-600"
                            htmlFor="task-description"
                        >
                            Description
                        </label>
                        <textarea
                            id="task-description"
                            name="description"
                            placeholder="Add a description..."
                            rows={5}
                            className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-3 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                </form>

                <footer className="flex items-center gap-3 border-t border-slate-100 px-5 py-4 sm:px-7">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <p
                        role={notification.message ? 'status' : undefined}
                        className={`flex-1 text-center text-sm ${
                            notification.status ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                    >
                        {notification.message}
                    </p>
                </footer>
            </section>
        </div>
    );
};
