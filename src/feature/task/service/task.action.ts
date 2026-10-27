'use server';

import { api } from '../../../service/api.Interceptor';
import { TaskCreate } from './task.type';

const TASK_API_PATH = '/task';

export async function create(data: TaskCreate) {
    return await api.post(`${TASK_API_PATH}/create`, data);
}
export async function get(boardId: string) {
    return await api.get(`${TASK_API_PATH}?boardId=${boardId}`);
}

export async function update(id: string, data: any) {
    return await api.patch(`${TASK_API_PATH}/${id}`, data);
}

export async function changePosition(taskId: string, cycleId: string, position: number) {
    return await api.patch(`${TASK_API_PATH}/position`, { taskId, cycleId, position });
}
