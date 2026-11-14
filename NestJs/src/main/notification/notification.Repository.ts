import { flatten, Injectable } from '@nestjs/common';
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
      actionrequestId: actionrequest[0].id,
      title: notification.title,
      message: notification.message,
      createdAt: notification.createdAt.toISOString(),
      metadata: actionrequest[0]?.metadata ?? null,
      expiredAt: actionrequest[0]?.expiresAt || null,
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
      },
    });

    if (!check || (check.expiresAt && check.expiresAt < new Date())) return;

    const member = await prisma.$transaction(async (tx) => {
      await tx.actionRequest.update({
        where: { id: acctionId },
        data: {
          status: 'ACCEPTED',
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
}
