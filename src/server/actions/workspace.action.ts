'use server';

import { auth } from '@/src/lib/auth';

import { getWorkspaceRepository } from '../workspace/workspace.Repository';
import { createWorkspaceService, getBoardService } from '../workspace/workspace.Service';

export const createWorkspace = async (formData: FormData) => {
    const session = await auth();
    const workspaceName = formData.get('workspaceName') as string;

    if (!session?.user.id) {
        return;
    }

    if (typeof workspaceName !== 'string' || !workspaceName.trim()) {
        return;
    }

    try {
        return await createWorkspaceService(workspaceName, BigInt(session.user.id));
    } catch (error) {
        return { success: false, message: 'Không thể tạo workspace' };
    }
};

export const workspaceOwn = async () => {
    const session = await auth();

    if (!session?.user.id) {
        return {
            yourOwn: [],
            yourMem: [],
        };
    }

    try {
        return await getWorkspaceRepository(BigInt(session.user.id));
    } catch (error) {
        return { success: false, message: 'Lấy workspace thất bại' };
    }
};

export const getBoard = async (workspaceUuid: string) => {
    return await getBoardService(workspaceUuid);
};
