import { createboardRepository, getBoardsRepository } from './board.Repository';
import { BoardService } from './board.Type';

export const createboardService = async (formData: FormData) => {
    const name = formData.get('name') as string;
    const workspaceUuid = formData.get('workspaceUuid') as string;

    if (!name) {
        throw new Error('Name is required');
    }
    if (!workspaceUuid) {
        throw new Error('WorkspaceUuid is required');
    }

    const columnsDefautl = [
        {
            id: 'l1',
            item: [
                { id: 'item1', name: 'To Do' },
                { id: 'item2', name: 'In Progress' },
                { id: 'item3', name: 'Done' },
            ],
        },
    ];

    const boardService: BoardService = {
        name,
        columnsJson: columnsDefautl,
    };
    return await createboardRepository(boardService, workspaceUuid);
};

export const getBoardService = async (workspaceUuid: string) => {
    const boards = await getBoardsRepository(workspaceUuid);
    return boards;
};
