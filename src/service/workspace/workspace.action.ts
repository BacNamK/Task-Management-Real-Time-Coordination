'use server';

import { api } from '../../lib/api/api.Interceptor';

const WORKSPACE_API_PATH = '/workspaces';

export async function getAllWorkspaces() {
    return api.get(WORKSPACE_API_PATH);
}

export async function createWorkspace(name: string) {
    const normalizedName = name.trim();
    if (!normalizedName) throw new Error('Workspace name is required');
    return api.post(WORKSPACE_API_PATH + '/create', { name: normalizedName });
}

export async function checkWorkspaceMember(workspaceUuid: string, userName: string) {
    return api.get(`${WORKSPACE_API_PATH}/member/${workspaceUuid}/${userName}`);
}

export async function addWorkspaceMember(workspaceUuid: string, userName: string) {
    return api.post(`${WORKSPACE_API_PATH}/member/${workspaceUuid}/add/${userName}`);
}
