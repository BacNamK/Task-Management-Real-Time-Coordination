import { BoardService } from '@/src/server/board/board.Type';
import prisma from '@/src/lib/prisma';

const returnWorkspaceId = async (workspaceUuid: string) => {
    return await prisma.workspace.findUnique({
        where: { uuid: workspaceUuid },
        select: { id: true },
    });
};

export const createboardRepository = async (board: BoardService, workspaceUuid: string) => {
    const workspace = await returnWorkspaceId(workspaceUuid);

    if (!workspace) {
        throw new Error('Workspace not found');
    }

    return await prisma.board.create({
        data: {
            name: board.name,
            columnsConfig: board.columnsJson,
            workspaceId: workspace.id,
        },
    });
};

export const getBoardsRepository = async (workspaceUuid: string) => {
    const workspace = await returnWorkspaceId(workspaceUuid);

    if (!workspace) {
        throw new Error('Workspace not found');
    }

    return await prisma.board.findMany({
        where: { workspaceId: workspace.id },
    });
};
