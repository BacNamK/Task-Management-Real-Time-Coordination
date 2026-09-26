// app/workspaces/[uuid]/page.tsx

import PageClient from '@/src/components/ui/board/PageClient';
import { getBoard } from '@/src/server/actions/workspace.action';

export default async function Page({ params }: { params: Promise<{ uuid: string }> }) {
    const { uuid } = await params;

    const board = await getBoard(uuid ? uuid : '');

    return <PageClient data={board} />;
}
