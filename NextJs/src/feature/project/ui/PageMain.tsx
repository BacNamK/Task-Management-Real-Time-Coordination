'use client';

import { FormCreate } from './form/Create';
import ListLayout from './component/ListLayout';
import { useState } from 'react';
import type { projectCollections } from '../sevice/project.type';

type Props = {
    initialprojects: projectCollections;
};

const ProjectPageClient = ({ initialprojects }: Props) => {
    return (
        <div className="PageMain-project h-full w-full overflow-y-auto">
            <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-2 p-5 sm:p-8">
                <ListLayout projects={initialprojects} />
            </div>
        </div>
    );
};

export default ProjectPageClient;
