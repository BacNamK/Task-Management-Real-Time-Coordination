import {
    addWorkspaceMemberRp,
    checkWorkspaceMemberRp,
    createWorkspaceRp,
} from './workspace.Repository';

const geneSlug = (string: string) => {
    return string
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-');
};

export const createWorkspaceService = async (workspaceName: string, userId: bigint) => {
    const slug = geneSlug(workspaceName);
    return await createWorkspaceRp(workspaceName, userId, slug);
};

export const checkWorkspaceMemberService = async (workspaceUuid: string, userName: string) => {
    return await checkWorkspaceMemberRp(workspaceUuid, userName);
};

export const addWorkspaceMemberService = async (workspaceId: any, userId: any) => {
    return await addWorkspaceMemberRp(workspaceId, userId);
};
