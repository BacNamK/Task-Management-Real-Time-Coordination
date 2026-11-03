export type ChatMessage = {
    id: string;
    roomUuid: string;
    text: string;
    createAt: string;
    sender: {
        id: string;
        name?: string | null;
        avatar?: string | null;
    };
    replyTo: { id: string; content: string | null } | null;
    deleted: boolean;
};
