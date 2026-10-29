'use client';

import { Item } from './Item';
import { FolderKanban, UsersRound } from 'lucide-react';
import type { projectCollections, projectListItem } from '../../sevice/project.type';
import { FormCreate } from '../form/Create';
import { useState } from 'react';

const ProjectSection = ({
    title,
    items,
    emptyMessage,
}: {
    title: string;
    icon: typeof FolderKanban;
    items: projectListItem[];
    emptyMessage: string;
}) => {
    const [projects, setprojects] = useState<any>(items);
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div className="">
                    <h2 className="text-base font-semibold text-green-500">{title}</h2>
                </div>
                {title.includes('Owned') && (
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
                )}
            </div>

            {projects.length > 0 ? (
                <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {projects.map((item) => (
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
};

const Listproject = ({ projects }: { projects: projectCollections }) => {
    const own = projects.yourOwn ?? [];
    const mem = projects.yourMem ?? [];
    return (
        <div className="ListLayout-project flex w-full flex-col gap-9 pb-8">
            <ProjectSection
                title="Owned Project"
                icon={FolderKanban}
                items={own}
                emptyMessage="You haven't created a project yet."
            />
            <ProjectSection
                title="Shared With You"
                icon={UsersRound}
                items={mem}
                emptyMessage="No one has shared a project with you yet."
            />
        </div>
    );
};

export default Listproject;
