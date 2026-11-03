export interface MessageSendType {
  roomUuid: string;
  content: string;
  senderId: string;
  replyToId?: string | null;
}

export type MessagePayload = Pick<MessageSendType, 'roomUuid' | 'content'> & {
  replyToId?: string | null;
};

export type MessageEmit = MessagePayload & {
  id: string;
  deleted: boolean;
  sender: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
  replyTo: { id: string; content: string | null } | null;
  createAt: string;
};
