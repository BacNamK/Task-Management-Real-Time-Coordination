'use server';

import { api } from '../../../service/api.Interceptor';
const CYCLE_API_PATH = '/cycle';

export async function addAction(boardId: string) {
    return await api.post(`${CYCLE_API_PATH}/add?boardId=${boardId}`);
}

export async function putAction(cycleId: string, data: any) {
    return await api.put(`${CYCLE_API_PATH}/put/${cycleId}`, data);
}

export async function deleteAction(cycleId: string) {
    return await api.delete(`${CYCLE_API_PATH}/delete/${cycleId}`);
}
