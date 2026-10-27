// app/projects/[uuid]/page.tsx

import PageMain from '../../../feature/project/ui/PageDetail';
import { target } from '../../../feature/project/sevice/project.action';

export default async function Page({ params }: { params: Promise<{ uuid: string }> }) {
    // uuid của project
    const { uuid } = await params;

    //api project/projectUuid
    const targetproject = await target(uuid);

    return <PageMain data={targetproject} />;
}
