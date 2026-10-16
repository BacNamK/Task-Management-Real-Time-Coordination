'use server';

import { api } from '../../lib/api/api.Interceptor';

const BOARD_API_PATH = '/board';

export class BoardAction {
    constructor() {}
    async get(workspaceUuid: string) {
        return await api.get(`${BOARD_API_PATH}/${workspaceUuid}`);
    }
    async create(formData: FormData) {
        return await api.post(`${BOARD_API_PATH}`, formData);
    }
    async find(boardId: bigint) {
        return await api.get(`${BOARD_API_PATH}/${boardId}`);
    }
    async update(boardId: bigint, data: any) {
        return await api.put(`${BOARD_API_PATH}/${boardId}`, data);
    }
    async addCycle(boardId: bigint) {
        return await api.post(`${BOARD_API_PATH}/${boardId}/cycle`);
    }
}
