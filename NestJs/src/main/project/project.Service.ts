import { Injectable, UnauthorizedException } from '@nestjs/common';
import { projectRepository } from './project.Repository.js';
import { NOTFOUND } from 'dns';

@Injectable()
export class projectService {
  constructor(private readonly Repository: projectRepository) {}

  async create(projectName: string, userId: string) {
    return await this.Repository.create(projectName, userId);
  }

  async gets(userId: string) {
    if (!userId || !/^\d+$/.test(userId)) {
      throw new UnauthorizedException('INVALID_USER_ID');
    }
    return this.Repository.gets(userId);
  }

  async target(uuid: string) {
    if (!uuid) return 'UUID_NOT_FOUND';
    return await this.Repository.target(uuid);
  }

  async checkMember(projectUuid: string, userName: string) {
    const member = await this.Repository.checkMember(projectUuid, userName);

    return member;
  }

  async addMember(projectId: bigint, userId: string) {
    return await this.Repository.addMember(projectId, userId);
  }
}
