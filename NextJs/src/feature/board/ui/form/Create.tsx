'use client';

import { create } from '../../service/board.action';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';

type Props = {
    projectUuid: string;
};

export const FormCreateBoard = ({ projectUuid }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const boardName = String(formData.get('name')).trim();
        if (!boardName) return;

        setIsSubmitting(true);
        setErrorMessage('');
        try {
            await create({ boardName, projectUuid });
            setIsOpen(false);
            form.reset();
            router.refresh();
        } catch (error) {
            console.error('Failed to create board:', error);
            setErrorMessage('Could not create board. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-Board flex items-center justify-end text-sm">
            {isOpen ? (
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:flex-row"
                >
                    <input type="hidden" name="projectUuid" value={projectUuid} />
                    <input
                        type="text"
                        name="name"
                        aria-label="Board name"
                        placeholder="Name your board"
                        required
                        autoFocus
                        disabled={isSubmitting}
                        className="h-10 min-w-0 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 sm:w-52"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-10 rounded-lg bg-indigo-600 px-4 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </button>
                    <button
                        type="button"
                        aria-label="Cancel creating board"
                        disabled={isSubmitting}
                        onClick={() => {
                            setIsOpen(false);
                            setErrorMessage('');
                        }}
                        className="flex h-10 items-center justify-center rounded-lg px-3 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    >
                        <X aria-hidden="true" size={17} />
                    </button>
                    {errorMessage && (
                        <p role="alert" className="basis-full text-xs text-rose-600 sm:hidden">
                            {errorMessage}
                        </p>
                    )}
                </form>
            ) : (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <Plus aria-hidden="true" size={17} />
                    New board
                </button>
            )}
            {errorMessage && (
                <p role="alert" className="ml-3 hidden text-xs text-rose-600 sm:block">
                    {errorMessage}
                </p>
            )}
        </div>
    );
};
