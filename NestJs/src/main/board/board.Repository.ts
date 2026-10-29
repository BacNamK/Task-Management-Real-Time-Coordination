import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma.Client.js';
import { CycleRepository } from '../cycle/cycle.Repository.js';
import { projectRepository } from '../project/project.Repository.js';
import { serializeBigInt } from '../../common/utils/bigint.util.js';

@Injectable()
export class BoardRepository {
  constructor(
    private readonly cycleRepository: CycleRepository,
    private readonly projectRepository: projectRepository,
  ) {}

  async create(boarName: string, projectUuid: string) {
    const project = await this.projectRepository.returnId(projectUuid);

    if (!project) {
      throw new Error('project not found');
    }

    const boardCr = await prisma.board.create({
      data: {
        title: boarName,

        projectId: project.id,
      },
    });

    return serializeBigInt(boardCr);
  }

  async get(projectUuid: any) {
    const board = await prisma.project.findFirst({
      where: {
        uuid: projectUuid,
      },
      select: {
        id: true,
        name: true,
        boards: {
          select: {
            cycles: {
              select: {
                id: true,
                title: true,
                position: true,
                columns: true,
                createdAt: true,
              },
              orderBy: {
                position: 'asc',
              },
            },

            tasks: {
              select: {
                id: true,
                title: true,
                position: true,
                description: true,
                createdAt: true,
                dueDate: true,
                cycleId: true,
                boardId: true,

                assigneeds: {
                  select: {
                    id: true,
                    user: {
                      select: {
                        id: true,
                        name: true,
                        avatar: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    return serializeBigInt(board);
  }

  async find(boardId: string) {
    const board = await prisma.board.findUnique({
      where: {
        id: BigInt(boardId),
      },
      select: {
        id: true,
        title: true,
        cycles: {
          select: {
            id: true,
            title: true,
            position: true,
            columns: true,
            createdAt: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            position: true,
            description: true,
            priority: true,
            createdAt: true,
            dueDate: true,
            cycleId: true,
            boardId: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            assigneeds: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!board) return null;

    const { cycles, ...boardDetails } = board;
    const tasks = boardDetails.tasks.map(({ user, ...task }) => ({
      ...task,
      censor: user,
    }));

    return serializeBigInt({ ...boardDetails, tasks, cycle: cycles });
  }
}
// export const updateboardRepository = async (boardId: bigint, rawdData: any) => {
//      return await prisma.board.update({
//          where: { id: boardId },
//          data: { c }
// })};
