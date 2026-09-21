'use server';

import { assignTask } from '../task/task.Type';
import { createTaskService } from '../task/task.Service';
import { getTaskRepository } from '../task/task.Repository';

export async function createTask(data: assignTask) {
    await createTaskService(data);
}

export async function getTask(boardId: bigint) {
    return await getTaskRepository(boardId);
}
