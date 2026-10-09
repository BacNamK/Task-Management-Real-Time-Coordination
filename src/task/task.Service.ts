import { assignTask } from './task.Dto.js';
import { TaskRepository } from './task.Repository.js';

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}
  async createTaskService(dataRequest: assignTask) {
    const data = {
      ...dataRequest,
      creatorId: Number(1),
    };

    await this.taskRepository.createTask(data);
  }

  async get(boardId: bigint) {
    return await this.taskRepository.get(boardId);
  }

  async changePosition(data: {
    taskId: bigint;
    cycleId: bigint;
    position: number;
  }) {
    return await this.taskRepository.changePosition(data);
  }
}
