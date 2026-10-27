'use client';

import { FormCreate } from './form/Create';
import ListLayout from './component/ListLayout';
import { useState } from 'react';
import type { projectCollections } from '../sevice/project.type';

type Props = {
    initialprojects: projectCollections;
};

const projectPageClient = ({ initialprojects }: Props) => {
    const [projects, setprojects] = useState<projectCollections>(initialprojects);

    return (
        <div className="PageMain-project h-full w-full overflow-y-auto">
            <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-8 p-5 sm:p-8">
                <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            project
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Your project</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Organize work and collaborate with your team.
                        </p>
                    </div>
                    <FormCreate
                        onCreate={(project) =>
                            setprojects((prev) => ({
                                ...prev,
                                yourOwn: [
                                    {
                                        project,
                                        owner: { name: null, image: null },
                                    },
                                    ...prev.yourOwn,
                                ],
                            }))
                        }
                    />
                </header>
                <ListLayout projects={projects} />
            </div>
        </div>
    );
};

export default projectPageClient;
