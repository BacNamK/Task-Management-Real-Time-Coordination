import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.Repository.js';
import { NotificationGateway } from '../realtime/con1/notification/notification.gateway.js';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notifiactionRepository: NotificationRepository,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async findByRecipientId(recipientId: string) {
    return this.notifiactionRepository.findByRecipientId(BigInt(recipientId));
  }

  async updateStatus(listIds: string[]) {
    await this.notifiactionRepository.updateSatus(listIds);
  }

  async handleAssigneeds(
    actorId: string,
    task: { id: bigint | string; title: string },
    assigneeds: Array<{ userId: string }>,
  ) {
    if (!assigneeds.length) return;

    const notifications = await this.notifiactionRepository.notificationAssigneeds(
      actorId,
      task,
      assigneeds.map(({ userId }) => userId),
    );

    if (notifications?.length) {
      this.notificationGateway.handleAssigneeds(notifications);
    }
  }
}
