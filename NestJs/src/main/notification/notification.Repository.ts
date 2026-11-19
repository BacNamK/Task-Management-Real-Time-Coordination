import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma.Client.js';

@Injectable()
export class NotificationRepository {
  async findByRecipientId(recipientId: bigint) {
    const receipts = await prisma.notificationReceipt.findMany({
      where: { recipientId },
      include: {
        actionrequest: {
          select: {
            id: true,
            metadata: true,
            status: true,
            expiresAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        notification: {
          select: {
            id: true,
            title: true,
            message: true,
            createdAt: true,

            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        notification: {
          createdAt: 'desc',
        },
      },
    });

    return receipts.map(({ notification, actionrequest, isRead, readAt }) => ({
      id: notification.id,
      actionrequestId: actionrequest[0]?.id ?? null,
      title: notification.title,
      message: notification.message,
      createdAt: notification.createdAt.toISOString(),
      metadata: actionrequest[0]?.metadata ?? null,
      expiredAt: actionrequest[0]?.expiresAt || null,
      status: actionrequest[0]?.status,
      sender: notification.user,
      isRead,
      readAt,
    }));
  }

  async acceptInviteProject(acctionId: string, user_Id: string) {
    const check = await prisma.actionRequest.findFirst({
      where: {
        id: acctionId,
        notificationReceipt: {
          recipientId: BigInt(user_Id),
        },
      },
      select: {
        entityId: true,
        expiresAt: true,
        metadata: true,
      },
    });

    if (!check || (check.expiresAt && check.expiresAt < new Date())) return;

    const path = check.metadata;

    function changePath(): string {
      if (typeof path !== 'string') return String(path);

      // projects/uuid/preview
      const idx = path.lastIndexOf('/');
      return idx !== -1 ? path.substring(0, idx) : path;
      // project/uuid
    }

    const member = await prisma.$transaction(async (tx) => {
      await tx.actionRequest.update({
        where: { id: acctionId },
        data: {
          status: 'ACCEPTED',
          metadata: changePath(),
          respondedAt: new Date(),
        },
      });

      if (!check.entityId) return null;

      return tx.projectMember.create({
        data: {
          role: 'MEMBER',
          userId: BigInt(user_Id),
          permissionId: 1,
          projectId: BigInt(check.entityId),
        },
      });
    });

    if (!member) return null;

    return {
      ...member,
      id: member.id.toString(),
      userId: member.userId.toString(),
      projectId: member.projectId.toString(),
    };
  }
  async updateSatus(listIds: string[]) {
    console.log(listIds);
    await prisma.notificationReceipt.updateMany({
      where: { notificationId: { in: listIds } },
      data: {
        isRead: true,
      },
    });
  }

  async notificationAssigneeds(
    actorId: string,
    task: { id: bigint | string; title: string },
    assigneeIds: string[],
  ) {
    const recipients = [...new Set(assigneeIds)].filter((id) => id !== actorId);
    if (!recipients.length) return;

    return prisma.$transaction(
      recipients.map((recipientId) =>
        prisma.notification.create({
          data: {
            type: 'TASK_ASSIGNED',
            actorId: BigInt(actorId),
            title: 'You have been assigned a task.',
            message: `You have been assigned to task "${task.title}".`,
            entityType: 'TASK',
            entityId: task.id.toString(),
            metadata: { taskId: task.id.toString() },
            receipts: {
              create: { recipientId: BigInt(recipientId) },
            },
          },
          include: { receipts: { select: { recipientId: true } } },
        }),
      ),
    );
  }
}
