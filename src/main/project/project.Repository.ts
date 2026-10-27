import { Injectable, UnauthorizedException } from '@nestjs/common';
import { prisma } from '../../lib/prisma.Client.js';
import { UsersRepository } from '../users/users.Repository.js';
import { serializeBigInt } from '../../common/utils/bigint.util.js';

@Injectable()
export class projectRepository {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(projectName: string, userId: string) {
    try {
      return await prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
          data: {
            name: projectName.trim(),
          },
        });

        await tx.projectMember.create({
          data: {
            projectId: project.id,
            userId: BigInt(userId),
            role: 'ADMIN',
            permissionId: 3, // Assuming 3 is the ID for the default permission
          },
        });

        return serializeBigInt(project);
      });
    } catch (error) {
      const isUniqueConstraintError =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002';

      if (!isUniqueConstraintError) throw error;
    }
  }

  async gets(userId: string) {
    const memberships = await prisma.projectMember.findMany({
      where: {
        user: {
          id: BigInt(userId),
        },
      },
      select: {
        role: true,
        project: {
          select: {
            uuid: true,
            name: true,
            createdAt: true,
            members: {
              where: {
                role: 'ADMIN',
              },
              take: 1,
              select: {
                user: {
                  select: {
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
            _count: {
              select: { members: true, boards: true },
            },
          },
        },
      },
    });

    return memberships.reduce(
      (result, membership) => {
        const admin = membership.project.members[0]?.user;

        const item = {
          project: {
            uuid: membership.project.uuid,
            name: membership.project.name,
            createdAt: membership.project.createdAt,
            _count: membership.project._count,
          },
          owner: {
            name: admin?.name ?? null,
            avatar: admin?.avatar ?? null,
          },
        };

        if (membership.role === 'ADMIN') {
          result.yourOwn.push(item);
        } else {
          result.yourMem.push(item);
        }

        return result;
      },
      {
        yourOwn: [] as any[],
        yourMem: [] as any[],
      },
    );
  }

  async target(uuid: string) {
    const result = await prisma.project.findUnique({
      where: {
        uuid: uuid,
      },
      select: {
        members: {
          select: {
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        boards: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                cycles: true,
                tasks: true,
              },
            },
          },
        },
      },
    });

    if (!result) return { message: 'NOT_FOUND' };

    return {
      boards: result.boards.map((board) => ({
        ...board,
        id: board.id.toString(),
        _count: {
          cycle: board._count.cycles,
          tasks: board._count.tasks,
        },
      })),
      members: result.members.map(({ role, user }) => ({
        id: user.id.toString(),
        name: user.name,
        avatar: user.avatar,
        role,
      })),
    };
  }

  async checkMember(projectUuid: string, userName: string) {
    if (!projectUuid || !userName) {
      return;
    }
    const user = await this.usersRepository.findUserByName(userName);
    if (!user) {
      return { message: 'User not found' };
    }

    const project = await prisma.project.findUnique({
      where: {
        uuid: projectUuid,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!project) {
      throw new Error('project not found');
    }

    const checkMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: project.id,
          userId: BigInt(user.id),
        },
      },
    });

    if (checkMember) {
      return { message: 'User already in project' };
    }

    return serializeBigInt({ user, projectId: project.id });
  }

  async addMember(projectId: any, userId: any) {
    await prisma.projectMember.create({
      data: {
        projectId,
        userId: BigInt(userId),
        role: 'MEMBER',
        permissionId: 3, // Assuming 3 is the ID for the default permission for members
      },
    });
  }

  async returnId(projectUuid: string) {
    return await prisma.project.findUnique({
      where: { uuid: projectUuid },
      select: { id: true },
    });
  }
}
