'use server';

import { api } from '../../../service/api.Interceptor';
import type { BoardView } from './board.type';
const BOARD_API_PATH = '/board';

export async function get(projectUuid: string) {
    return await api.get(`${BOARD_API_PATH}?projectUuid=${encodeURIComponent(projectUuid)}`);
}
export async function create(formData: { boardName: string; projectUuid: string }) {
    return await api.post(`${BOARD_API_PATH}/create`, formData);
}
export async function find(boardId: string) {
    return await api.get<BoardView>(`${BOARD_API_PATH}/${boardId}`);
}
export async function update(boardId: string, data: { name?: string; title?: string }) {
    return await api.put(`${BOARD_API_PATH}/${boardId}`, data);
}
