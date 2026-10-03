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
            <div className="w-full flex justify-end items-center text-sm">
                {isOpen ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="border-b-2 border-red-300 text-red-500 px-4"
                        >
                            Cancel
                        </button>
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input type="hidden" name="workspaceUuid" value={workspaceUuid} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Name board"
                                className="border-b-2 border-gray-300 px-4 py-2 w-full outline-none"
                            />
                            <button
                                type="submit"
                                className="border-b-2 border-green-300 text-green-500 block px-4 py-2"
                            >
                                Create
                            </button>
                        </form>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex p-2 rounded-[5px] bg-green-300 shadow gap-4 items-center"
                    >
                        <span className="text-black/70 text-sm">Board</span>
                        <span className="bg-white rounded-full flex items-center justify-center size-4">
                            <Image src="/add.png" alt="board" width={18} height={18} />
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};
