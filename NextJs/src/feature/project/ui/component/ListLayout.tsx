'use client';

import { Item } from './Item';
import { FolderKanban, UsersRound } from 'lucide-react';
import type { projectCollections, projectListItem } from '../../sevice/project.type';

const projectSection = ({
    title,
    description,
    icon: Icon,
    items,
    emptyMessage,
}: {
    title: string;
    description: string;
    icon: typeof FolderKanban;
    items: projectListItem[];
    emptyMessage: string;
}) => (
    <section className="space-y-4">
        <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon aria-hidden="true" size={18} />
            </div>
            <div>
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                <p className="mt-0.5 text-sm text-slate-500">{description}</p>
            </div>
            <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {items.length}
            </span>
        </div>

        {items.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

const Listproject = ({ projects }: { projects: projectCollections }) => {
    const own = projects.yourOwn ?? [];
    const mem = projects.yourMem ?? [];
    return (
        <div className="ListLayout-project flex w-full flex-col gap-9 pb-8">
            <projectSection
                title="Owned project"
                description="project you created and manage."
                icon={FolderKanban}
                items={own}
                emptyMessage="You haven't created a project yet."
            />
            <projectSection
                title="Shared with you"
                description="project where you collaborate with others."
                icon={UsersRound}
                items={mem}
                emptyMessage="No one has shared a project with you yet."
            />
        </div>
    );
};

export default Listproject;
