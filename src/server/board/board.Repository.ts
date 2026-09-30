import { BoardService } from '@/src/server/board/board.Type';
import prisma from '@/src/lib/prisma';
import { createCycleRp } from '@/src/server/cycle/cycleRepository';

export const returnWorkspaceId = async (workspaceUuid: string) => {
    return await prisma.workspace.findUnique({
        where: { uuid: workspaceUuid },
        select: { id: true },
    });
};

export const createboardRepository = async (rData: BoardService, workspaceUuid: string) => {
    const workspace = await returnWorkspaceId(workspaceUuid);

    if (!workspace) {
        throw new Error('Workspace not found');
    }

    const boardCr = await prisma.board.create({
        data: {
            name: rData.name,
            workspaceId: workspace.id,
        },
    });

    await createCycleRp(Number(boardCr.id));
};

export const getBoardsRepository = async (workspaceUuid: string) => {
    const workspace = await returnWorkspaceId(workspaceUuid);
    if (!workspace) {
        throw new Error('Workspace not found');
    }

    const workspaceData = await prisma.workspace.findUnique({
        where: {
            id: workspace.id,
        },
        select: {
            uuid: true,
            name: true,
            slug: true,
            createdAt: true,

            boards: {
                select: {
                    id: true,
                    name: true,
                    cycle: {
                        select: {
                            title: true,
                            position: true,
                            columns: true,
                            createdAt: true,
                        },
                    },
                },
            },
        },
    });

    if (!workspaceData) {
        throw new Error('Workspace not found');
    }

    return workspaceData;
};

export const findboardRepository = async (boardId: bigint, workspaceUuid: string) => {
    return await prisma.board.findFirst({
        where: { id: boardId },
        select: {
            id: true,
            name: true,
            createdAt: true,
            cycle: {
                select: {
                    id: true,
                    title: true,
                    position: true,
                    columns: true,
                    createdAt: true,
                    task: {
                        select: {
                            id: true,
                            title: true,
                            position: true,
                            description: true,
                            createdAt: true,
                            dueDate: true,
                            assigneeds: {
                                select: {
                                    id: true,
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            image: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
};

// export const updateboardRepository = async (boardId: bigint, rawdData: any) => {
//      return await prisma.board.update({
//          where: { id: boardId },
//          data: { c }
// })};
