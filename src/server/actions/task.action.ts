'use server';

import { changePositionService, createTaskService } from '../task/task.Service';
import { getTaskRepository } from '../task/task.Repository';
import { updateCycleColumnsRp } from '../cycle/cycleRepository';

export async function createTask(data: any) {
    await createTaskService(data);
}

export async function getTask(boardId: bigint) {
    return await getTaskRepository(boardId);
}

export async function updateTaskAc(id: any, rawdData: any) {
    return updateCycleColumnsRp(id, rawdData);
}

export async function changePositionAc(data: {
    taskId: bigint;
    cycleId: bigint;
    position: number;
}) {
    return await changePositionService(data);
}
