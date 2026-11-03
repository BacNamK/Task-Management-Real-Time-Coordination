import Image from 'next/image';
import {
    EclipseIcon,
    EllipsisVertical,
    EllipsisVerticalIcon,
    MessageSquareReply,
    Replace,
    Reply,
    Trash2,
} from 'lucide-react';
import type { ChatMessage } from './chatMessage.type';
import { useState } from 'react';

type ChatMessageItemProps = {
    message: ChatMessage;
    previousSenderId?: string;
    currentUserId?: string;
    onReply: (message: ChatMessage) => void;
    onDelete: (messageId: string) => void;
};

const ChatMessageItem = ({
    message,
    previousSenderId,
    currentUserId,
    onReply,
    onDelete,
}: ChatMessageItemProps) => {
    const isCurrentUser = String(message.sender.id) === currentUserId;
    const showSenderDetails = previousSenderId !== message.sender.id;

    const [btnDel, setBtnDel] = useState(false);

    return (
        <div className="group flex w-full items-center gap-2">
            {/* Tin nhắn của người dùng hiện tại */}
            {isCurrentUser ? (
                <div className="flex w-full items-end mb-2 justify-end gap-1">
                    <div className="max-w-[75%] text-right">
                        {showSenderDetails && (
                            <span className="mb-1 block text-xs text-slate-400">
                                {new Intl.DateTimeFormat(undefined, {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                }).format(new Date(message.createAt))}
                            </span>
                        )}
                        {message.replyTo && (
                            <div className="mb-1 rounded-lg bg-indigo-100 px-3 py-1.5 text-left text-xs text-indigo-900">
                                {message.replyTo.content ?? 'Tin nhắn đã bị xóa'}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            {!message.deleted && (
                                <div className="flex shrink-0 items-center gap-5 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                                    <div
                                        className="group flex items-center gap-2"
                                        onMouseLeave={() => setBtnDel(false)}
                                    >
                                        {isCurrentUser && (
                                            <button
                                                type="button"
                                                onClick={() => onDelete(message.id)}
                                                aria-label="Delete message"
                                                hidden={!btnDel}
                                                className="rounded-md p-1 text-slate-400 transition hover:bg-red-100 hover:text-red-600"
                                            >
                                                <Trash2 size={16} aria-hidden="true" />
                                            </button>
                                        )}
                                        <EllipsisVerticalIcon
                                            size={20}
                                            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                                            onClick={() => setBtnDel((prev) => !prev)}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onReply(message)}
                                        aria-label="Reply to message"
                                        className="rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                                    >
                                        <Reply size={16} aria-hidden="true" />
                                    </button>
                                </div>
                            )}
                            <p
                                className={` rounded-2xl rounded-br-md px-4 py-2.5 text-left text-sm leading-5 shadow-sm ${
                                    message.deleted
                                        ? 'bg-slate-200 italic text-slate-500'
                                        : 'bg-indigo-600 text-white'
                                }`}
                            >
                                {message.text}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                /* Tin nhắn của người khác */
                <div className="flex w-full items-end gap-2">
                    <div className="w-8 h-8">
                        {showSenderDetails && message.sender.avatar && (
                            <Image
                                src={message.sender.avatar}
                                height={32}
                                width={32}
                                alt=""
                                className="shrink-0 rounded-full object-cover"
                            />
                        )}
                    </div>

                    <div className="max-w-[75%]">
                        {showSenderDetails && (
                            <span className="mb-1 block text-xs text-slate-400">
                                {new Intl.DateTimeFormat(undefined, {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                }).format(new Date(message.createAt))}
                            </span>
                        )}
                        {message.replyTo && message.deleted === null ? (
                            <div className="mb-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
                                {message.replyTo.content ?? 'Tin nhắn đã bị xóa'}
                            </div>
                        ) : (
                            ''
                        )}
                        <p
                            className={`whitespace-pre-wrap break-words rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-5 shadow-sm ring-1 ring-slate-200 ${
                                message.deleted
                                    ? 'bg-slate-100 italic text-slate-500'
                                    : 'bg-white text-slate-700'
                            }`}
                        >
                            {message.text}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatMessageItem;
