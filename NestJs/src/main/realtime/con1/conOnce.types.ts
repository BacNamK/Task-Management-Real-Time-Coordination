export interface MessageSendType {
  roomUuid: string;
  content: string;
  senderId: bigint;
  createAt?: Date;
  updateAt?: Date;
}

export type MessagePayload = Pick<MessageSendType, 'roomUuid' | 'content'>;

export type MessageEmit = MessagePayload & {
  senderId: string;
  createAt: string;
};
