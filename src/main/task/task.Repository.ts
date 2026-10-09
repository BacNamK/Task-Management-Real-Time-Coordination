import { prisma } from '../lib/prisma.Client.js';

export class TaskRepository {
  async createTask(data: any) {
    const task = await prisma.task.create({
      data: {
        ...data.task,
        creatorId: data.creatorId,
      },
    });

    for (const assignee of data.assigneeds) {
      await prisma.assigneeds.create({
        data: {
          taskId: task.id,
          userId: Number(assignee.userId),
        },
      });
    }
  }

  async get(boardId: bigint) {
    return await prisma.task.findMany({
      where: {
        boardId: boardId,
      },
    });
  }
  async changePosition(data: {
    taskId: bigint;
    cycleId: bigint;
    position: number;
  }) {
    return await prisma.task.update({
      where: {
        id: data.taskId,
      },
      data: {
        cycleId: data.cycleId,
        position: data.position,
      },
    });
  }
}
