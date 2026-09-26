import { BoardService } from '@/src/server/board/board.Type';
import prisma from '@/src/lib/prisma';

export const returnWorkspaceId = async (workspaceUuid: string) => {
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

export const findboardRepository = async (boardId: bigint, workspaceUuid: string) => {
    return await prisma.board.findFirst({
        where: { id: boardId, workspace: { uuid: workspaceUuid } },
        include: { task: true },
    });
};

export const updateboardRepository = async (boardId: bigint, workspaceUuid: string, data: any) => {
    return await prisma.board.update({
        where: { id: boardId, workspace: { uuid: workspaceUuid } },
        data: {
            columnsConfig: data,
        },
    });
};
