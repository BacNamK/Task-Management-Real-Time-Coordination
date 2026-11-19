import { Injectable } from '@nestjs/common';
import { TaskDto } from './task.Dto.js';
import { TaskRepository } from './task.Repository.js';
import { NotificationService } from '../notification/notification.Service.js';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly notificationService: NotificationService,
  ) {}
  async create(dataRequest: TaskDto, userId: string) {
    try {
      const result = await this.taskRepository.create(dataRequest, userId);

      if (result) {
        const createdTask = JSON.parse(result) as {
          id: string;
          title: string;
        };
        await this.notificationService.handleAssigneeds(
          userId,
          createdTask,
          dataRequest.assigneeds,
        );
      }
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async get(boardId: bigint) {
    return await this.taskRepository.get(boardId);
  }

  async update(id: bigint, data: any, userId: bigint) {
    // Kiểm tra user có quyền update task không? if không thì throw error

    return await this.taskRepository.update(id, data);
  }

  async changePosition(data: {
    taskId: bigint;
    cycleId: bigint;
    position: number;
  }) {
    return await this.taskRepository.changePosition(data);
  }
}
