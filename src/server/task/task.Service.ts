import { assignTask } from './task.Type';
import { createTaskRepository, getTaskRepository } from './task.Repository';
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
