'use client';

import { useContext, useEffect, useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { AuthContext } from '../../../components/context/ContextProvide';
import { useSocket } from '../../../lib/socket/socketConText';
import { type RoomType } from '../service/chat.type';
import Image from 'next/image';
type ChatMessage = {
    id: any;
    text: string;
    time: string;
    sender: any;
};

const BoxChat = ({ chatRooms }: { chatRooms: RoomType[] }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [room, setRoom] = useState<RoomType | undefined>(chatRooms[0]);
    const socket = useSocket();
    const user = useContext(AuthContext);
    const currentUser = user;

    useEffect(() => {
        if (!socket || !room) return;

        socket.emit('joinRoom', room.uuid);
    }, [socket, room]);

    const sendMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const text = message.trim();
        if (!text || !socket || !room) return;

        setMessages((current) => [
            ...current,
            {
                id: currentUser.id,
                text,
                sender: currentUser,
                time: new Intl.DateTimeFormat(undefined, {
                    hour: 'numeric',
                    minute: '2-digit',
                }).format(new Date()),
            },
        ]);
        setMessage('');

        const data = {
            content: text,
            roomUuid: room.uuid,
        };

        socket.emit('chats', data);
    };

    useEffect(() => {
        if (!socket) return;

        const onChat = (data: { content: string; createAt: string; sender: any }) => {
            console.log(data);
            setMessages((current) => [
                ...current,
                {
                    id: data.sender.id,
                    text: data.content,
                    sender: data.sender,
                    time: new Intl.DateTimeFormat(undefined, {
                        hour: 'numeric',
                        minute: '2-digit',
                    }).format(new Date(data.createAt)),
                },
            ]);
        };

        socket.on('chats', onChat);
        return () => {
            socket.off('chats', onChat);
        };
    }, [socket]);

    return (
        <div className="w-full h-full flex">
            <section className="w-3/4 flex h-full min-h-0 flex-col overflow-hidden">
                <div
                    className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-slate-50/70 px-4 py-5 sm:px-6"
                    aria-live="polite"
                    aria-label="Chat messages"
                >
                    {messages.map((item, index: number) => (
                        <div key={index} className="flex w-full">
                            {String(item.id) === currentUser.id ? (
                                <div className="flex w-full items-end justify-end gap-2">
                                    <div className="max-w-[75%] text-right">
                                        <span className="mb-1 block text-xs text-slate-400">
                                            {item.time}
                                        </span>
                                        <p className="whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-indigo-600 px-4 py-2.5 text-left text-sm leading-5 text-white shadow-sm">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex w-full items-end justify-start gap-2">
                                    <Image
                                        src={item.sender.avatar}
                                        height={32}
                                        width={32}
                                        alt=""
                                        className="shrink-0 rounded-full object-cover"
                                    ></Image>
                                    <div className="max-w-[75%]">
                                        <span className="mb-1 block text-xs text-slate-400">
                                            {item.time}
                                        </span>
                                        <p className="whitespace-pre-wrap break-words rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm leading-5 text-slate-700 shadow-sm ring-1 ring-slate-200">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={sendMessage} className="shrink-0 p-3 sm:p-4">
                    <label htmlFor="chat-message" className="sr-only">
                        Type a message
                    </label>
                    <div className="flex items-end gap-2 border-b-2 p-0.5 transition ">
                        <textarea
                            id="chat-message"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' && !event.shiftKey) {
                                    event.preventDefault();
                                    event.currentTarget.form?.requestSubmit();
                                }
                            }}
                            placeholder="Write a message..."
                            rows={1}
                            className="max-h-28 min-h-10 min-w-0 flex-1 resize-y bg-transparent px-2.5 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim()}
                            aria-label="Send message"
                            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                        >
                            <Send size={17} aria-hidden="true" />
                        </button>
                    </div>
                </form>
            </section>
            <section className="w-1/4 h-full p-4">
                <div className="flex h-full w-full flex-col gap-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                    {chatRooms.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setRoom(item)}
                            className={`flex h-10 cursor-pointer items-center rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors ${room?.id === item.id ? 'bg-amber-100 ' : ''}`}
                        >
                            <span># {item.name}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default BoxChat;
