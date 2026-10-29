import { notFound } from 'next/navigation';
import { Model } from '../../../../feature/board/ui/component/Model';
import { find } from '../../../../feature/board/service/board.action';

export default async function Page({
    params,
}: {
    params: Promise<{ uuid: string; id: string }>;
}) {
    const { uuid, id: boardId } = await params;

    // sub query
    const board = await find(boardId);
    if (!board) {
        notFound();
    }

    return (
        <div className="relative h-screen w-full">
            <Model board={board} projectUuid={uuid} />
        </div>
    );
}
