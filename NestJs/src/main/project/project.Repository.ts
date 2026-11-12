import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { prisma } from '../../lib/prisma.Client.js';
import { UsersRepository } from '../users/users.Repository.js';
import { serializeBigInt } from '../../common/utils/bigint.util.js';
import { ProjectType } from './project.Types.js';

@Injectable()
export class projectRepository {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(projectName: string, userId: string): Promise<ProjectType> {
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
          role: 'OWNER',
          permissionId: 3, // Assuming 3 is the ID for the default permission
        },
      });

      return project;
    });
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
            description: true,
            members: {
              where: {
                role: 'OWNER',
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
            description: membership.project.description,
            _count: membership.project._count,
          },
          owner: {
            name: admin?.name ?? null,
            avatar: admin?.avatar ?? null,
          },
        };

        if (membership.role === 'OWNER') {
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
        id: true,
        uuid: true,
        name: true,
        createdAt: true,
        description: true,
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
            description: true,
            _count: {
              select: {
                cycles: true,
                tasks: true,
              },
            },
          },
        },
        chatRooms: {
          select: {
            id: true,
            uuid: true,
            name: true,
            isDirect: true,
          },
        },
      },
    });

    if (!result) return null;

    return {
      id: result.id.toString(),
      uuid: result.uuid,
      name: result.name,
      createdAt: result.createdAt,
      description: result.description,
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
      chatRooms: result.chatRooms.map((room) => ({
        ...room,
        id: room.id.toString(),
        uuid: room.uuid,
        name: room.name,
        isdirect: room.isDirect,
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
      throw new NotFoundException('PROJECT_NOT_FOUND');
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

  async addMember(projectUuid: string, userId: string, actorId: string) {
    if (!projectUuid) throw new NotFoundException('PROJECT_NOT_FOUND');
    const project = await prisma.project.findUnique({
      where: { uuid: projectUuid },
      select: { id: true, uuid: true },
    });
    if (!project) throw new NotFoundException('PROJECT_NOT_FOUND');
    return prisma.$transaction(async (tx) => {
      const noti = await tx.notification.create({
        data: {
          type: 'MEMBER_JOINED',
          title: 'You have an invitation to join a project',
          entityType: 'project',
          entityId: project.id.toString(),
          actorId: BigInt(actorId),
        },
      });

      const receipt = await tx.notificationReceipt.create({
        data: {
          notificationId: noti.id,
          recipientId: BigInt(userId),
        },
      });

      const actionRequest = await tx.actionRequest.create({
        data: {
          title: '',
          senderId: BigInt(actorId),
          receiptId: receipt.id,
          type: 'PROJECT_INVITATION',
          entityType: 'project',
          entityId: project.id.toString(),
          metadata: `/projects/${project.uuid}/preview`,
          expiresAt: new Date(Date.now() + 3 * 60 * 60 * 24 * 1000),
        },
      });

      return { noti, receipt, actionRequest };
    });
  }

  async findProject(projectUuid: string) {
    return await prisma.project.findUnique({
      where: { uuid: projectUuid },
      select: { id: true },
    });
  }

  async returnProjectsMemberUuid(userId: string): Promise<string[]> {
    const list = await prisma.projectMember.findMany({
      where: { userId: BigInt(userId) },
      select: {
        project: {
          select: { uuid: true },
        },
      },
    });

    return list.map((item) => String(item.project.uuid));
  }

  async findActionRequest(userId: string, projectUuid: string) {
    const projectId = await this.findProject(projectUuid);
    await prisma.actionRequest.findFirst({
      where: {
        receiptId: userId,
        entityType: 'project',
        entityId: String(projectId),
      },
    });
    return await prisma.project.findUnique({
      where: { uuid: projectUuid },
      select: {
        uuid: true,
        name: true,
        description: true,
        members: {
          where: { role: 'OWNER' },
          select: {
            role: true,
            user: {
              select: { name: true, avatar: true },
            },
          },
        },
      },
    });
  }
}
