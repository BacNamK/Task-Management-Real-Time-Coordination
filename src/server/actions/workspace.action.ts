'use server';

import { auth } from '@/src/lib/auth';

import { getWorkspaceRp } from '../workspace/workspace.Repository';
import {
    addWorkspaceMemberService,
    checkWorkspaceMemberService,
    createWorkspaceService,
} from '../workspace/workspace.Service';

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
        return await getWorkspaceRp(BigInt(session.user.id));
    } catch (error) {
        return { success: false, message: 'Lấy workspace thất bại' };
    }
};

export const checkWorkspaceMemberAc = async (workspaceUuid: string, userName: string) => {
    return await checkWorkspaceMemberService(workspaceUuid, userName);
};

export const addWorkspaceMember = async (data: any) => {
    const session = await auth();

    if (!session?.user.id) {
        return;
    }

    try {
        return await addWorkspaceMemberService(data.workspaceId, data.userId);
    } catch (error) {
        return { success: false, message: 'Thêm thành viên thất bại' };
    }
};
