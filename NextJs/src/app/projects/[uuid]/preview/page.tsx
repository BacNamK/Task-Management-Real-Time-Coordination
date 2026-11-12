export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import PageMain from '../../../../feature/project/ui/ProjectDetail';
import { target } from '../../../../feature/project/sevice/project.action';
import { ApiError } from '../../../../service/api.Interceptor';

export default async function PagePreview({
    params,
}: {
    params: Promise<{ uuid: string }>;
}) {
    const { uuid } = await params;
    let project: Awaited<ReturnType<typeof target>>;

    try {
        project = await target(uuid);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            notFound();
        }

        throw error;
    }

    return <PageMain data={project} />;
}
