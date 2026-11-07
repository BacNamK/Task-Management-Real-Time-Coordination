// app/projects/[uuid]/page.tsx

export const dynamic = 'force-dynamic';

import PageMain from '../../../feature/project/ui/PageDetail';
import { target } from '../../../feature/project/sevice/project.action';
import { ApiError } from '../../../service/api.Interceptor';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ uuid: string }> }) {
    // uuid của project
    const { uuid } = await params;

    //api project/projectUuid
    let targetproject;
    try {
        targetproject = await target(uuid);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            notFound();
        }
        throw error;
    }

    return <PageMain data={targetproject} />;
}
