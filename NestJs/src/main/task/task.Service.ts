import { Injectable } from '@nestjs/common';
import { TaskDto } from './task.Dto.js';
import { TaskRepository } from './task.Repository.js';

@Injectable()
export class TaskService {
  constructor(private readonly Repository: TaskRepository) {}
  async create(dataRequest: TaskDto, userId: string) {
    return this.Repository.create(dataRequest, userId);
  }

  async get(boardId: bigint) {
    return await this.Repository.get(boardId);
  }

  async update(id: bigint, data: any, userId: bigint) {
    // Kiểm tra user có quyền update task không? if không thì throw error

    return await this.Repository.update(id, data);
  }

  async changePosition(data: {
    taskId: bigint;
    cycleId: bigint;
    position: number;
  }) {
    return await this.Repository.changePosition(data);
  }
}
