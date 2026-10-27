'use client';

import { create } from '../../sevice/project.action';
import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import type { project } from '../../sevice/project.type';

export const FormCreate = ({ onCreate }: { onCreate: (project: project) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const submittingRef = useRef(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submittingRef.current) return;

        const formData = new FormData(event.currentTarget);
        const projectName = String(formData.get('projectName')).trim();
        if (!projectName) return;

        submittingRef.current = true;
        setIsSubmitting(true);
        try {
            const project = await create(projectName);
            setErrorMessage('');
            setIsOpen(false);
            onCreate(project);
        } catch (error) {
            console.error('Failed to create project:', error);
            setErrorMessage('Could not create project. Please try again.');
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    }

    return (
        <div className="Form-project w-full sm:w-auto">
            {isOpen ? (
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:flex-wrap"
                >
                    <label className="sr-only" htmlFor="project-name">
                        Project name
                    </label>
                    <input
                        id="project-name"
                        type="text"
                        name="projectName"
                        placeholder="Name your project"
                        required
                        autoFocus
                        disabled={isSubmitting}
                        className="h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 sm:w-56"
                    />
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => {
                                setIsOpen(false);
                                setErrorMessage('');
                            }}
                            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                    {errorMessage && (
                        <p className="basis-full px-1 text-xs text-rose-600" role="alert">
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
                    New project
                </button>
            )}
        </div>
    );
};
