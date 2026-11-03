import { useLayoutEffect, useRef } from 'react';
import ChatMessageItem from './ChatMessageItem';
import type { ChatMessage } from './chatMessage.type';

type ChatMessageListProps = {
    messages: ChatMessage[];
    currentUserId?: string;
    onReply: (message: ChatMessage) => void;
    onDelete: (messageId: string) => void;
};

const ChatMessageList = ({ messages, currentUserId, onReply, onDelete }: ChatMessageListProps) => {
    const listRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const list = listRef.current;
        if (list) {
            list.scrollTop = list.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            ref={listRef}
            className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-slate-50/70 px-4 py-5 sm:px-6"
            aria-live="polite"
            aria-label="Chat messages"
        >
            {messages.map((message, index) => {
                const previousMessage = messages[index - 1];
                const timeSincePreviousMessage = previousMessage
                    ? new Date(message.createAt).getTime() -
                      new Date(previousMessage.createAt).getTime()
                    : 0;
                const showDateSeparator =
                    index > 0 && timeSincePreviousMessage > 24 * 60 * 60 * 1000;

                return (
                    <div key={message.id}>
                        {showDateSeparator && (
                            <div className="my-2 text-center text-xs text-slate-400">
                                {new Intl.DateTimeFormat('vi-VN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                }).format(new Date(message.createAt))}
                            </div>
                        )}
                        <ChatMessageItem
                            message={message}
                            previousSenderId={previousMessage?.sender.id}
                            currentUserId={currentUserId}
                            onReply={onReply}
                            onDelete={onDelete}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default ChatMessageList;
