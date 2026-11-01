export interface MessageSendType {
  roomUuid: string;
  content: string;
  senderId: string;
  createAt?: Date;
  updateAt?: Date;
}

export type MessagePayload = Pick<MessageSendType, 'roomUuid' | 'content'>;

export type MessageEmit = MessagePayload & {
  sender: any;
  createAt: string;
};
