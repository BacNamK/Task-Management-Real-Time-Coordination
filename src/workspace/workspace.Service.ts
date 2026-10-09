import { Injectable } from '@nestjs/common';
import { WorkspaceRp } from './workspace.Repository.js';

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

@Injectable()
export class WorkspaceService {
  constructor(private readonly workspaceRepository: WorkspaceRp) {}
  async create(workspaceName: string, userId: bigint) {
    const slug = geneSlug(workspaceName);
    return await this.workspaceRepository.create(workspaceName, userId, slug);
  }

  async checkMember(workspaceUuid: string, userName: string) {
    return await this.workspaceRepository.checkMember(workspaceUuid, userName);
  }

  async addMember(workspaceId: any, userId: any) {
    return await this.workspaceRepository.addMember(workspaceId, userId);
  }
}
