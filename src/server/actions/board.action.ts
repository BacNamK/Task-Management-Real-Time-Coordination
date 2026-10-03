'use server';

import {
    addCycleBoardService,
    createboardService,
    findboardService,
    updateboardService,
} from '@/src/server/board/board.Service';
import { getBoardService } from '../board/board.Service';

export const getBoard = async (workspaceUuid: string) => {
    return await getBoardService(workspaceUuid);
};

export const createboard = async (formData: FormData) => {
    return await createboardService(formData);
};

export const findBoard = async (boardId: bigint) => {
    return await findboardService(boardId);
};

export const updateBoard = async (boardId: bigint, data: any) => {
    return await updateboardService(boardId, data);
};

export const addCycleBoard = async (boardId: bigint) => {
    return await addCycleBoardService(boardId);
};
