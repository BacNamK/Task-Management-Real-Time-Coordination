import { FormCreateBoard } from '@/src/components/forms/CreateBoard';
import { Model } from '@/src/components/ui/board/Model';
import { getBoard } from '@/src/server/actions/board.action';
type Props = {
    searchParams: Promise<{ uuid?: string }>;
};

export default async function WorkspaceDetail({ searchParams }: Props) {
    const { uuid } = await searchParams;

    const board = await getBoard(uuid ?? '');

    return (
        <div>
            <FormCreateBoard workspaceUuid={uuid ?? ''} />
            <div className="p-4">
                {board.map((items: any, index: number) => (
                    <Model key={index} board={items} />
                ))}
            </div>
        </div>
    );
}
