'use client';

import { redirect } from 'next/navigation';
import { acceptInviteProject } from '../notification/service/notification.action';

export default function PagePreviewCient({
    project,
    actionId,
}: {
    project: any;
    actionId: string;
}) {
    const handleActionInvite = async () => {
        const result: any = await acceptInviteProject(actionId);

        if (result.success) {
            redirect(`/projects/${project.uuid}`);
        }
    };
    return (
        <main className="min-h-screen bg-slate-50 px-4 sm:px-6">
            <header className="px-6 py-6 sm:px-8">
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                    {project.name}
                </h1>
                <div className="flex flex-col-reverse gap-3 bg-slate-50/70 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
                    <button
                        type="button"
                        className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Refusion
                    </button>
                    <button
                        onClick={handleActionInvite}
                        type="button"
                        className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                        Accept
                    </button>
                </div>
            </header>

            <section className="px-6 py-8 sm:px-8" aria-label="Project description">
                <h2 className="text-sm font-semibold text-slate-700">About this project</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {project.description || 'No description provided.'}
                </p>
            </section>
        </main>
    );
}
