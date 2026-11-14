import { notFound } from 'next/navigation';
import { preview } from '../../../../feature/project/sevice/project.action';
import { ApiError } from '../../../../service/api.Interceptor';
import PagePreviewCient from '../../../../feature/project/pagePreviewClient';

export default async function PagePreview({
    params,
    searchParams,
}: {
    params: Promise<{ uuid: string }>;
    searchParams: Promise<{ id?: string }>;
}) {
    const [{ uuid }, { id }] = await Promise.all([params, searchParams]);

    if (!id) notFound();

    const project = await preview(uuid);

    return <PagePreviewCient project={project} actionId={id} />;
}
