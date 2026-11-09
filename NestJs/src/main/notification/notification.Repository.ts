import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma.Client.js';

@Injectable()
export class NotificationRepository {
  async findByRecipientId(recipientId: string) {
    const receipts = await prisma.notificationReceipt.findMany({
      where: { recipientId },
      include: {
        notification: {
          include: {
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

    return receipts.map(({ notification, isRead, readAt }) => ({
      ...notification,
      actorId: notification.actorId.toString(),
      actorName: notification.user.name,
      actorAvatar: notification.user.avatar,
      isRead,
      readAt,
    }));
  }
}
