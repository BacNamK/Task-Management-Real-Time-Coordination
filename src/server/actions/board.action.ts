'use server';

import { createboardService, getBoardService } from '@/src/server/board/board.Service';

export const createboard = async (formData: FormData) => {
    return await createboardService(formData);
};

export const getBoard = async (workspaceUuid: string) => {
    return await getBoardService(workspaceUuid);
};
