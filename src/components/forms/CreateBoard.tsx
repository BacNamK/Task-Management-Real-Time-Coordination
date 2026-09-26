'use client';

import { createboard } from '@/src/server/actions/board.action';
import { useState } from 'react';
import Image from 'next/image';

type props = {
    workspaceUuid: string;
};

export const FormCreateBoard = ({ workspaceUuid }: props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        try {
            const res = await createboard(formData);
            setIsOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="w-full flex justify-end items-center p-2  pr-2">
                {isOpen ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="bg-red-300 p-2 rounded-md px-4"
                        >
                            Hủy{' '}
                        </button>
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input type="hidden" name="workspaceUuid" value={workspaceUuid} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Tên board"
                                className="bg-gray-100 px-4 py-2 rounded-md w-full"
                            />
                            <button
                                type="submit"
                                className="bg-green-300 block px-4 py-2 rounded-md"
                            >
                                Tạo
                            </button>
                        </form>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex border p-2 rounded-md bg-green-300 shadow"
                    >
                        <span className="text-black/70 text-sm font-medium">Board</span>
                        <Image src="/add.png" alt="board" width={20} height={20} />
                    </button>
                )}
            </div>
        </div>
    );
};
