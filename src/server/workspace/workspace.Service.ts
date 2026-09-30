import { createWorkspaceRepository } from './workspace.Repository';

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
    return await createWorkspaceRepository(workspaceName, userId, slug);
};
