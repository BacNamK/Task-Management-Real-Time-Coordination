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

    const workspaceData = await prisma.workspace.findUnique({
        where: {
            id: workspace.id,
        },
        select: {
            name: true,
            slug: true,
            createdAt: true,

            boards: {
                select: {
                    name: true,
                    columnsConfig: true,

                    task: {
                        select: {
                            title: true,
                            description: true,
                            createdAt: true,
                            dueDate: true,
                            columnId: true,

                            assigneeds: {
                                select: {
                                    userId: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!workspaceData) {
        throw new Error('Workspace not found');
    }

    const result = {
        ...workspaceData,

        boards: workspaceData.boards.map((board) => ({
            ...board,

            task: board.task.reduce<Record<string, typeof board.task>>((result, task) => {
                if (!task.columnId) {
                    return result;
                }

                if (!result[task.columnId]) {
                    result[task.columnId] = [];
                }

                result[task.columnId].push(task);

                return result;
            }, {}),
        })),
    };
};
