'use client';

import { useState } from 'react';
import { Item } from './ui/component/ProjectItem';
import { FormCreate } from './ui/form/Create';
import type { project, projectCollections, projectListItem } from './sevice/project.type';

type Props = {
    initialprojects: projectCollections;
};

type ProjectSectionProps = {
    title: string;
    items: projectListItem[];
    emptyMessage: string;
    onCreate?: (project: project) => void;
};

const ProjectSection = ({ title, items, emptyMessage, onCreate }: ProjectSectionProps) => (
    <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-green-500">{title}</h2>
            {onCreate && <FormCreate onCreate={onCreate} />}
        </div>

        {items.length > 0 ? (
            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                    <Item item={item} key={item.project.uuid} />
                ))}
            </div>
        ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-500">
                {emptyMessage}
            </div>
        )}
    </section>
);

const ProjectPageClient = ({ initialprojects }: Props) => {
    const [ownedProjects, setOwnedProjects] = useState(initialprojects.yourOwn ?? []);
    const sharedProjects = initialprojects.yourMem ?? [];

    const handleCreateProject = (project: project) => {
        setOwnedProjects((projects) => [
            { project, owner: { name: null, image: null } },
            ...projects,
        ]);
    };

    return (
        <div className="PageMain-project h-full w-full overflow-y-auto">
            <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-2 p-5 sm:p-8">
                <div className="ListLayout-project flex w-full flex-col gap-9 pb-8">
                    <ProjectSection
                        title="Owned Project"
                        items={ownedProjects}
                        emptyMessage="You haven't created a project yet."
                        onCreate={handleCreateProject}
                    />
                    <ProjectSection
                        title="Shared With You"
                        items={sharedProjects}
                        emptyMessage="No one has shared a project with you yet."
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectPageClient;
