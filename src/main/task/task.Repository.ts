import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma.Client.js';
import { serializeBigInt } from '../../common/utils/bigint.util.js';

@Injectable()
export class TaskRepository {
  async create(data: any, userId: string) {
    const task = await prisma.$transaction(async (tx) => {
      const createdTask = await tx.task.create({
        data: {
          title: data.title,
          description: data.description || null,
          position: data.position,
          dueDate: data.dueDate || null,
          cycleId: data.cycleId ? BigInt(data.cycleId) : null,
          boardId: BigInt(data.boardId),
          creatorId: BigInt(userId),
        },
      });

      if (data.assigneeds?.length) {
        await tx.assigneeds.createMany({
          data: data.assigneeds.map((assignee: { userId: string }) => ({
            taskId: createdTask.id,
            userId: BigInt(assignee.userId),
          })),
          skipDuplicates: true,
        });
      }

      return createdTask;
    });

    return serializeBigInt(task);
  }

  async get(boardId: bigint) {
    const tasks = await prisma.task.findMany({
      where: {
        boardId: boardId,
      },
    });
    return serializeBigInt(tasks);
  }
  async update(id: bigint, data: any) {
    const task = await prisma.task.update({
      where: {
        id: id,
      },
      data: data,
    });
    return serializeBigInt(task);
  }
  async changePosition(data: {
    taskId: bigint;
    cycleId: bigint;
    position: number;
  }) {
    const task = await prisma.task.update({
      where: {
        id: data.taskId,
      },
      data: {
        cycleId: data.cycleId,
        position: data.position,
      },
    });
    return serializeBigInt(task);
  }
}
