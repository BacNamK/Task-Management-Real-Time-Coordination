import { notFound } from 'next/navigation';
import { Model } from '@/src/components/ui/board/Model';
import { findBoard } from '@/src/server/actions/board.action';

export default async function Page({ params }: { params: Promise<{ uuid: string; id: string }> }) {
    const { uuid, id } = await params;
    const boardId = BigInt(id);

    // sub query
    const board = await findBoard(boardId, uuid);
    if (!board) {
        notFound();
    }

    return (
        <div className="relative h-screen w-full">
            <Model board={board} />
        </div>
    );
}
