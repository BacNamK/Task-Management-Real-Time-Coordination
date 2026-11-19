'use server';

import { api } from '../../../service/api.Interceptor';
import { TaskCreate } from './task.type';

const TASK_API_PATH = '/task';

export async function createTask(dataTask: TaskCreate) {
    return await api.post(`${TASK_API_PATH}/create`, dataTask);
}
export async function getTask(boardId: string) {
    return await api.get(`${TASK_API_PATH}?boardId=${boardId}`);
}

export async function updateTask(id: string, data: any) {
    return await api.patch(`${TASK_API_PATH}/${id}`, data);
}

export async function changePositionTask(taskId: string, cycleId: string, position: number) {
    return await api.patch(`${TASK_API_PATH}/position`, { taskId, cycleId, position });
}
