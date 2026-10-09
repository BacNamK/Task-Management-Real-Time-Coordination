import { prisma } from '../lib/prisma.Client.js';
import { CycleRp } from '../cycle/cycleRepository.js';
import { WorkspaceRp } from '../workspace/workspace.Repository.js';

export class BoardRepository {
  constructor(
    private readonly cycleRepository: CycleRp,
    private readonly workspaceRepository: WorkspaceRp,
  ) {}

  async create(rData: any, workspaceUuid: string) {
    const workspace = await this.workspaceRepository.returnId(workspaceUuid);

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const boardCr = await prisma.board.create({
      data: {
        name: rData.name,
        workspaceId: workspace.id,
      },
    });

    await this.cycleRepository.create(Number(boardCr.id));
  }

  async get(workspaceUuid: string) {
    const workspace = await this.workspaceRepository.returnId(workspaceUuid);
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const workspaceData = await prisma.workspace.findUnique({
      where: {
        id: workspace.id,
      },
      select: {
        uuid: true,
        name: true,
        boards: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                cycle: true,
                tasks: true,
              },
            },
          },
        },
        members: {
          select: {
            role: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!workspaceData) {
      throw new Error('Workspace not found');
    }

    return workspaceData;
  }

  async find(boardId: bigint) {
    return await prisma.board.findFirst({
      where: { id: boardId },
      select: {
        id: true,
        name: true,
        createdAt: true,
        cycle: {
          select: {
            id: true,
            title: true,
            position: true,
            columns: true,
            createdAt: true,
          },
        },
        tasks: {
          where: {
            boardId: boardId,
          },
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
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
// export const updateboardRepository = async (boardId: bigint, rawdData: any) => {
//      return await prisma.board.update({
//          where: { id: boardId },
//          data: { c }
// })};
