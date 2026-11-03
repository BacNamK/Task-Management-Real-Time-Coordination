'use client';

import { useContext, useEffect, useState, type FormEvent } from 'react';
import { AuthContext } from '../../../components/context/ContextProvide';
import { useSocket } from '../../../lib/socket/socketConText';
import { type RoomType } from '../service/chat.type';
import ChatMessageComposer from './component/ChatMessageComposer';
import ChatMessageList from './component/ChatMessageList';
import ChatRoomList from './component/ChatRoomList';
import type { ChatMessage } from './component/chatMessage.type';

const mergeMessages = (current: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] => {
    const byId = new Map(current.map((item) => [item.id, item]));

    for (const item of incoming) {
        const existing = byId.get(item.id);
        if (existing?.deleted && !item.deleted) {
            continue;
        }

        byId.set(
            item.id,
            existing?.replyTo &&
                item.replyTo &&
                existing.replyTo.id === item.replyTo.id &&
                existing.replyTo.content === null &&
                item.replyTo.content !== null
                ? { ...item, replyTo: existing.replyTo }
                : item
        );
    }

    return [...byId.values()].sort(
        (left, right) => new Date(left.createAt).getTime() - new Date(right.createAt).getTime()
    );
};

const toChatMessage = (data: {
    id: string;
    roomUuid: string;
    content: string;
    createAt: string;
    sender: ChatMessage['sender'];
    replyTo: ChatMessage['replyTo'];
    deleted: boolean;
}): ChatMessage => ({
    id: data.id,
    roomUuid: data.roomUuid,
    text: data.content,
    createAt: data.createAt,
    sender: data.sender,
    replyTo: data.replyTo,
    deleted: data.deleted,
});

const BoxChat = ({ chatRooms }: { chatRooms: RoomType[] }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
    const [room, setRoom] = useState<RoomType | undefined>(chatRooms[0]);
    const socket = useSocket();
    const user = useContext(AuthContext);
    const currentUser = user;

    useEffect(() => {
        if (!socket || !room) return;

        const roomUuid = room.uuid;
        setMessages([]);
        setReplyTo(null);

        const onChat = (data: Parameters<typeof toChatMessage>[0]) => {
            if (data.roomUuid !== roomUuid) return;
            setMessages((current) => mergeMessages(current, [toChatMessage(data)]));
        };

        const onMessagesLoaded = (data: {
            roomUuid: string;
            messages: Parameters<typeof toChatMessage>[0][];
        }) => {
            if (data.roomUuid !== roomUuid) return;
            setMessages((current) => mergeMessages(current, data.messages.map(toChatMessage)));
        };

        const onMessageDeleted = (data: { messageId: string; roomUuid: string }) => {
            if (data.roomUuid !== roomUuid) return;
            setMessages((current) =>
                current.map((item) => ({
                    ...item,
                    ...(item.id === data.messageId
                        ? { text: 'Tin nhắn đã bị xóa', deleted: true }
                        : {}),
                    ...(item.replyTo?.id === data.messageId
                        ? { replyTo: { ...item.replyTo, content: null } }
                        : {}),
                }))
            );
            setReplyTo((current) => (current?.id === data.messageId ? null : current));
        };

        const joinAndLoadMessages = () => {
            socket.emit('joinRoom', roomUuid);
            socket.emit('loadMessages', { roomUuid });
        };

        socket.on('chats', onChat);
        socket.on('messagesLoaded', onMessagesLoaded);
        socket.on('messageDeleted', onMessageDeleted);
        socket.on('connect', joinAndLoadMessages);
        if (socket.connected) {
            joinAndLoadMessages();
        }

        return () => {
            socket.off('connect', joinAndLoadMessages);
            if (socket.connected) {
                socket.emit('leaveRoom', roomUuid);
            }
            socket.off('chats', onChat);
            socket.off('messagesLoaded', onMessagesLoaded);
            socket.off('messageDeleted', onMessageDeleted);
        };
    }, [socket, room]);

    const sendMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const text = message.trim();
        if (!text || !socket || !room) return;

        const data = {
            content: text,
            roomUuid: room.uuid,
            replyToId: replyTo?.id ?? null,
        };

        socket.emit('chats', data);
        setMessage('');
        setReplyTo(null);
    };

    const deleteMessage = (messageId: string) => {
        if (!socket || !room) return;
        socket.emit('deleteMessage', { messageId, roomUuid: room.uuid });
    };

    return (
        <div className="w-full h-full flex">
            <section className="w-3/4 flex h-full min-h-0 flex-col overflow-hidden">
                <ChatMessageList
                    messages={messages}
                    currentUserId={currentUser?.id}
                    onReply={setReplyTo}
                    onDelete={deleteMessage}
                />
                <ChatMessageComposer
                    message={message}
                    replyTo={replyTo}
                    onMessageChange={setMessage}
                    onCancelReply={() => setReplyTo(null)}
                    onSubmit={sendMessage}
                />
            </section>
            <ChatRoomList chatRooms={chatRooms} selectedRoom={room} onSelectRoom={setRoom} />
        </div>
    );
};

export default BoxChat;
