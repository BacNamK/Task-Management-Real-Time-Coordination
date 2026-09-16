'use client';

import { createWorkspace } from '@/src/server/actions/workspace.action';
import { useState } from 'react';

export const FormCreateWorkspace = ({ onCreate }: { onCreate: (workspace: any) => void }) => {
    const [isOpen, setIsopen] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        try {
            const res = await createWorkspace(formData);

            console.log(res);

            setIsopen(false);
            onCreate(res);
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <div className="w-full justify-items-end p-2">
            {isOpen ? (
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsopen(!isOpen)}
                        className="block p-2 w-20 rounded-xl bg-red-300"
                    >
                        Hủy
                    </button>
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            name="workspaceName"
                            placeholder="Name ..."
                            className="p-2 bg-gray-200 rounded-xl"
                        />
                        <button type="submit" className="block w-20 rounded-xl bg-green-300 p-2">
                            Tạo
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsopen(!isOpen)}
                    className="block w-20 rounded-xl bg-green-300 p-2"
                >
                    Tạo
                </button>
            )}
        </div>
    );
};
