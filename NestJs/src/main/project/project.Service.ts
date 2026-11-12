import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { projectRepository } from './project.Repository.js';
import { ChatRepository } from '../realtime/con1/chat/chat.repository.js';
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
    await this.ChatRepository.createRoom(BigInt(project.id));

    return serializeBigInt(project);
  }

  async gets(userId: string) {
    if (!userId || !/^\d+$/.test(userId)) {
      throw new UnauthorizedException('INVALID_USER_ID');
    }
    return this.Repository.gets(userId);
  }

  async target(uuid: string) {
    if (!uuid) {
      throw new BadRequestException('UUID_REQUIRED');
    }

    const project = await this.Repository.target(uuid);
    if (!project) {
      throw new NotFoundException('PROJECT_NOT_FOUND');
    }

    return project;
  }

  async checkMember(projectUuid: string, userName: string) {
    const member = await this.Repository.checkMember(projectUuid, userName);

    return member;
  }

  async addMember(projectUuid: string, userId: string, actorId: string) {
    return await this.Repository.addMember(projectUuid, userId, actorId);
  }

  async verify(userId: string, projectUuid: string) {
    return await this.Repository.findActionRequest(userId, projectUuid);
  }
}
