import Image from 'next/image';

import addIcon from '@/public/add.png';
import { useEffect, useState } from 'react';
import { createTask } from '@/src/server/actions/task.action';

type user = {
    name: string;
    image: string;
};

export const CreateTask = ({
    users,
    boardId,
    setIsOpen,
    isOpen,
}: {
    users: any;
    boardId: any;
    isOpen: any;
    setIsOpen: (edit: any) => void;
}) => {
    const [isOpenBox, setIsOpenBox] = useState(false);
    const [user, setUser] = useState<any[]>([]);

    const [notification, setNotification] = useState({ status: false, message: '' });

    const validate = (formData: any) => {
        const title = formData.get('title') as string;
        if (!title) {
            return false;
        }
        return true;
    };

    const showNotification = (status: boolean, message: string) => {
        setNotification({ status, message });
        setTimeout(() => {
            setNotification({ status: false, message: '' });
        }, 7000);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (!validate(formData)) {
            showNotification(false, 'Please fill in title');
            return;
        }
        const userId = user.map((item: any) => item.user.name).join(',');
        await createTask({
            task: {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                dueDate: new Date(formData.get('dueDate') as string),
                position: 0,
                cycleId: null,
                boardId: boardId,
            },
            assigneeds: [
                {
                    userId: userId.split(',') as string[],
                },
            ],
        });

        e.target.reset();
        showNotification(true, 'Task created successfully');
    };

    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-2xl p-4">
            <div className="relative w-full max-w-3xl rounded-xl border border-gray-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="flex h-20 items-center justify-between px-6">
                    {/* Assignee */}
                    <div className="relative flex h-full flex-1 items-center">
                        <button
                            type="button"
                            onClick={() => setIsOpenBox(!isOpenBox)}
                            className="flex h-10 items-center gap-2 border-b-2 border-gray-200 px-2 text-sm text-gray-600 hover:bg-gray-100"
                        >
                            <span>Assignee</span>
                            <Image
                                src={addIcon}
                                alt="add"
                                width={24}
                                height={24}
                                className="rounded-full bg-gray-200 p-1"
                            />
                        </button>

                        {/* Selected users */}
                        <div className="ml-3 flex items-center gap-2">
                            {user?.map((item: any, index: number) => (
                                <div key={index}>
                                    <Image
                                        src={item.user.image}
                                        alt={item.user.name}
                                        width={32}
                                        height={32}
                                        className="size-8 rounded-full object-cover ring-2 ring-white"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* User dropdown */}
                        {isOpenBox && (
                            <div className="absolute left-0 top-[calc(100%-8px)] z-50 w-105 rounded-lg border border-gray-200 bg-white p-2 shadow-xl">
                                <div className="mb-2 px-2 py-1 text-xs font-medium text-gray-500">
                                    Select assignees
                                </div>

                                <div className="grid grid-cols-2 gap-1">
                                    {users.map((item: any, index: number) => (
                                        <button
                                            type="button"
                                            onClick={() => setUser([...user, item])}
                                            key={index}
                                            className="flex items-center gap-3 rounded-md p-2 text-left hover:bg-gray-100"
                                        >
                                            <Image
                                                src={item.user.image}
                                                alt={item.user.name}
                                                width={32}
                                                height={32}
                                                className="size-8 rounded-full object-cover"
                                            />

                                            <span className="truncate text-sm text-gray-700">
                                                {item.user.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Create */}
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            form="create-task-form"
                            disabled={notification.status}
                            className={
                                notification.status
                                    ? 'cursor-not-allowed'
                                    : 'px-3 py-2 text-sm font-medium text-green-600 border-b-2 border-green-600 hover:bg-green-50'
                            }
                        >
                            Create Task
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form id="create-task-form" onSubmit={handleSubmit} className="space-y-6 p-6 pb-0">
                    {/* Task name + due date */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Task name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-600">
                                Task name
                            </label>

                            <input
                                name="title"
                                type="text"
                                placeholder="Enter task name"
                                className="h-11 w-full border-b-2 border-gray-300 px-3 text-sm outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-300"
                            />
                        </div>

                        {/* Due date */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-600">
                                Due date
                            </label>

                            <input
                                name="dueDate"
                                type="date"
                                className="h-11 w-full border-b-2 border-gray-300 px-3 text-sm outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-300"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-600">
                            Description
                        </label>

                        <textarea
                            name="description"
                            placeholder="Add a description..."
                            rows={5}
                            className="w-full resize-none border-b-2 border-gray-300 bg-gray-50 px-3 py-3 text-sm outline-none transition focus:border-gray-500 focus:bg-white focus:ring-1 focus:ring-gray-300"
                        />
                    </div>
                </form>
                {/* Cancel form create Task and notification */}
                <div className="flex ml-2 p-4">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className=" px-3 p-2 text-red-500 hover:bg-red-50 border-b-2 border-red-500"
                    >
                        Cancel
                    </button>
                    {/* Notification */}
                    {notification && (
                        <div
                            className={`text-sm w-full justify-center flex items-center ${notification.status ? 'text-green-600' : 'text-red-600'}`}
                        >
                            <p>{notification.message}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
