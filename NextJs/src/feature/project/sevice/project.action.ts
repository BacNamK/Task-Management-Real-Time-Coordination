'use server';

import { api } from '../../../service/api.Interceptor';
import type {
    project,
    projectCollections,
    projectDetail,
    projectMemberSearchResult,
} from './project.type';

const project_API_PATH = '/projects';

export async function getAll() {
    return api.get<projectCollections>(project_API_PATH);
}

export async function target(uuid: string) {
    return api.get<projectDetail>(`${project_API_PATH}/target?uuid=${encodeURIComponent(uuid)}`);
}

export async function create(name: string) {
    const normalproject = name.trim();
    if (!normalproject) throw new Error('project name is required');
    return api.post<project>(`${project_API_PATH}/create`, {
        projectName: normalproject,
    });
}

export async function checkMember(uuid: string, userName: string) {
    const params = new URLSearchParams({ projectUuid: uuid, userName: userName });
    return api.get<projectMemberSearchResult>(
        `${project_API_PATH}/checkMember?${params.toString()}`
    );
}

export async function addMember(id: string, userId: string) {
    const params = new URLSearchParams({ projectId: id, userId });
    return api.post(`${project_API_PATH}/addMember?${params.toString()}`);
}
