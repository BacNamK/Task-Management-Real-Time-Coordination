import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.Repository.js';

@Injectable()
export class NotificationService {
  constructor(private readonly repository: NotificationRepository) {}

  async findByRecipientId(recipientId: string) {
    if (!/^\d+$/.test(recipientId)) {
      throw new BadRequestException('INVALID_USER_ID');
    }

    return this.repository.findByRecipientId(BigInt(recipientId));
  }
}
