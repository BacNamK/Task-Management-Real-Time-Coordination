import { createWorkspace } from './workspace.action';

export class WorkspaceService {
    async create(name: string) {
        return createWorkspace(name);
    }
}
