import {
    createboardRepository,
    findboardRepository,
    updateboardRepository,
} from './board.Repository';
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
            name: 'Default',
            item: [
                { id: '0', name: 'To Do' },
                { id: '1', name: 'In Progress' },
                { id: '2', name: 'Done' },
            ],
        },
    ];

    const boardService: BoardService = {
        name,
        columnsJson: columnsDefautl,
    };
    return await createboardRepository(boardService, workspaceUuid);
};

export const findboardService = async (boardId: bigint, workspaceUuid: string) => {
    return await findboardRepository(boardId, workspaceUuid);
};

export const updateboardService = async (
    boardId: bigint,
    workspaceUuid: string,
    data: any
) => {
    return await updateboardRepository(boardId, workspaceUuid, data);
};
