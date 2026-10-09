import { prisma } from '../../lib/prisma.Client.js';
import { UsersRepository } from '../users/users.Repository.js';

export class WorkspaceRepository {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(workspaceName: string, userId: bigint, slug: string) {
    const workspace = await prisma.workspace.create({
      data: {
        name: workspaceName.trim(),
        slug: slug,
      },
    });

    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: BigInt(userId),
        role: 'ADMIN',
      },
    });
    return workspace;
  }

  async get(userUuid: string) {
    const memberships = await prisma.workspaceMember.findMany({
      where: {
        user: {
          uuid: userUuid,
        },
      },
      select: {
        role: true,
        workspace: {
          select: {
            uuid: true,
            name: true,
            slug: true,
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
                    image: true,
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
        const admin = membership.workspace.members[0]?.user;

        const item = {
          workspace: {
            uuid: membership.workspace.uuid,
            name: membership.workspace.name,
            slug: membership.workspace.slug,
            createdAt: membership.workspace.createdAt,
            _count: membership.workspace._count,
          },
          owner: {
            name: admin?.name ?? null,
            image: admin?.image ?? null,
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

  async checkMember(workspaceUuid: string, userName: string) {
    if (!workspaceUuid || !userName) {
      return;
    }
    const user = await this.usersRepository.findUserByName(userName);
    if (!user) {
      return { message: 'User not found' };
    }

    const workspace = await prisma.workspace.findUnique({
      where: {
        uuid: workspaceUuid,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const checkMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId: BigInt(user.id),
        },
      },
    });

    if (checkMember) {
      return { message: 'User already in workspace' };
    }

    return { user, workspaceId: workspace.id };
  }

  async addMember(workspaceId: any, userId: any) {
    await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: BigInt(userId),
        role: 'MEMBER',
      },
    });
  }

  async returnId(workspaceUuid: string) {
    return await prisma.workspace.findUnique({
      where: { uuid: workspaceUuid },
      select: { id: true },
    });
  }
}
