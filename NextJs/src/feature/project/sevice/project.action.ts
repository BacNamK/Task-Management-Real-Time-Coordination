'use server';

import { api } from '../../../service/api.Interceptor';
import type {
    project,
    projectCollections,
    projectDetail,
    projectMemberSearchResult,
} from './project.type';

const PROJECT_API_PATH = '/projects';

export async function getAll() {
    return api.get<projectCollections>(PROJECT_API_PATH);
}

export async function target(uuid: string) {
    return api.get<projectDetail>(`${PROJECT_API_PATH}/target?uuid=${encodeURIComponent(uuid)}`);
}

export async function create(name: string) {
    const normalproject = name.trim();
    if (!normalproject) throw new Error('project name is required');
    return api.post<project>(`${PROJECT_API_PATH}/create`, {
        projectName: normalproject,
    });
}

export async function checkMember(uuid: string, userName: string) {
    const params = new URLSearchParams({ projectUuid: uuid, userName: userName });
    return api.get<projectMemberSearchResult>(
        `${PROJECT_API_PATH}/checkMember?${params.toString()}`
    );
}

export async function addMember(uuid: string, userId: string) {
    const params = new URLSearchParams({ projectUuid: uuid, userId });
    return api.post(`${PROJECT_API_PATH}/addMember?${params.toString()}`);
}

export async function preview(uuid: string) {
    return api.get(`${PROJECT_API_PATH}/${uuid}/preview`);
}
