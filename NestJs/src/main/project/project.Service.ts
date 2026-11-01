import { Injectable, UnauthorizedException } from '@nestjs/common';
import { projectRepository } from './project.Repository.js';
import { NOTFOUND } from 'dns';
import { ChatRepository } from '../realtime/con1/chat/chat.repository.js';
import { ProjectType } from './project.Types.js';
import { serializeBigInt } from '../../common/utils/bigint.util.js';

@Injectable()
export class projectService {
  constructor(
    private readonly Repository: projectRepository,
    private readonly ChatRepository: ChatRepository,
  ) {}

  async create(projectName: string, userId: string) {
    const project = await this.Repository.create(projectName, userId);

    if (!project) return;
    // Bắt lỗi

    //
    await this.ChatRepository.createRoom(Number(project.id));

    return serializeBigInt(project);
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
