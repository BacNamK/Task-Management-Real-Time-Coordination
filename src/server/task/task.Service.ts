import { assignTask } from './task.Type';
import { changePositionRp, createTaskRepository, getTaskRepository } from './task.Repository';
import { auth } from '@/src/lib/auth';

export async function createTaskService(dataRequest: assignTask) {
    const Session = await auth();

    const id = Session?.user.id;

    const data = {
        ...dataRequest,
        creatorId: Number(id),
    };

    await createTaskRepository(data);
}

export async function getTaskService(boardId: bigint) {
    return await getTaskRepository(boardId);
}

export async function changePositionService(data: {
    taskId: bigint;
    cycleId: bigint;
    position: number;
}) {
    return await changePositionRp(data);
}
