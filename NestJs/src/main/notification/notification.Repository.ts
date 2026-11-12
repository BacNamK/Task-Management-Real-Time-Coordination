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
      title: notification.title,
      message: notification.message,
      createdAt: notification.createdAt.toISOString(),
      metadata: actionrequest[0]?.metadata ?? null,
      sender: notification.user,
      isRead,
      readAt,
    }));
  }
}
