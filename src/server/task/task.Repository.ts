import prisma from '@/src/lib/prisma';

export async function createTaskRepository(data: any) {
    const task = await prisma.task.create({
        data: {
            ...data.task,
            creatorId: data.creatorId,
        },
    });

    for (const assignee of data.assigneeds) {
        await prisma.assigneeds.create({
            data: {
                taskId: task.id,
                userId: Number(assignee.userId),
            },
        });
    }
}

export async function getTaskRepository(boardId: bigint) {
    return await prisma.task.findMany({
        where: {
            boardId: boardId,
        },
    });
}
