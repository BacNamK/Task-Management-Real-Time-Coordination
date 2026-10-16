'use server';

import { api } from '../../lib/api/api.Interceptor';
import { TaskChangePosition } from './task.type';

const TASK_API_PATH = '/task';

export class TaskAction {
    constructor() {}
    async create(data: any) {
        await api.post(TASK_API_PATH, data);
    }
    async get(boardId: bigint) {
        return await api.get(`${TASK_API_PATH}?boardId=${boardId}`);
    }

    async update(id: bigint, data: any) {
        return await api.patch(`${TASK_API_PATH}/${id}`, data);
    }

    async changePosition(data: TaskChangePosition) {
        return await api.patch(`${TASK_API_PATH}/position`, data);
    }
}
