'use server';

import {
    createboardService,
    findboardService,
    updateboardService,
} from '@/src/server/board/board.Service';

export const createboard = async (formData: FormData) => {
    return await createboardService(formData);
};

export const findBoard = async (boardId: bigint, workspaceUuid: string) => {
    return await findboardService(boardId, workspaceUuid);
};

export const updateBoard = async (boardId: bigint, workspaceUuid: string, data: any) => {
    return await updateboardService(boardId, workspaceUuid, data);
};
