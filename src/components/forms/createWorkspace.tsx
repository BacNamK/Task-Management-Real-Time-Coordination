'use client';

import { createWorkspace } from '@/src/server/actions/workspace.action';
import { useState } from 'react';
import Image from 'next/image';

export const FormCreateWorkspace = ({ onCreate }: { onCreate: (workspace: any) => void }) => {
    const [isOpen, setIsopen] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        try {
            const res = await createWorkspace(formData);

            setIsopen(false);
            onCreate(res);
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <div className="w-full h-13 flex items-center bg-green-300">
            <h3 className="text-white p-4 w-1/12">You Own</h3>
            {isOpen ? (
                <div className="flex gap-2 bg-white w-full h-full text-sm pl-5">
                    <button
                        onClick={() => setIsopen(!isOpen)}
                        className="block p-2 w-20 border-b-2 border-red-300 text-red-500"
                    >
                        Cancel
                    </button>
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            name="workspaceName"
                            placeholder="Name Workspace"
                            required
                            className="p-2 border-b-2 border-gray-200 outline-none"
                        />
                        <button
                            type="submit"
                            className="block w-20 border-b-2 border-green-300 text-green-500"
                        >
                            Create
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsopen(!isOpen)}
                    className="block bg-white rounded-full p-1 scale-80"
                >
                    <Image src="/add.png" alt="add" width={20} height={20} />
                </button>
            )}
        </div>
    );
};
