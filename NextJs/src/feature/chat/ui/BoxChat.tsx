'use client';

import { useState, type FormEvent } from 'react';
import { MessageCircle, Send } from 'lucide-react';

type ChatMessage = {
    id: number;
    text: string;
    time: string;
};

const BoxChat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const sendMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const text = message.trim();
        if (!text) return;

        setMessages((current) => [
            ...current,
            {
                id: Date.now(),
                text,
                time: new Intl.DateTimeFormat(undefined, {
                    hour: 'numeric',
                    minute: '2-digit',
                }).format(new Date()),
            },
        ]);
        setMessage('');
    };

    return (
        <div className="w-full h-full flex">
            <section className="w-3/4 flex h-full min-h-0 flex-col overflow-hidden">
                <div
                    className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-slate-50/70 px-4 py-5 sm:px-6"
                    aria-live="polite"
                    aria-label="Chat messages"
                >
                    {messages.length === 0 ? (
                        <div className="m-auto flex max-w-xs flex-col items-center px-4 py-10 text-center">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-indigo-500 shadow-sm ring-1 ring-slate-100">
                                <MessageCircle size={22} aria-hidden="true" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-slate-800">
                                Start the conversation
                            </h3>
                            <p className="mt-1.5 text-sm leading-5 text-slate-500">
                                Share an update, ask a question, or say hello to your team.
                            </p>
                        </div>
                    ) : (
                        messages.map((item) => (
                            <article key={item.id} className="flex justify-end">
                                <div className="max-w-[85%] sm:max-w-[70%]">
                                    <div className="mb-1 flex items-center justify-end gap-2 px-1">
                                        <time className="text-[11px] text-slate-400">
                                            {item.time}
                                        </time>
                                        <span className="text-xs font-medium text-slate-600">
                                            You
                                        </span>
                                    </div>
                                    <p className="whitespace-pre-wrap wrap-break-word rounded-2xl rounded-tr-md bg-indigo-600 px-4 py-2.5 text-sm leading-5 text-white shadow-sm">
                                        {item.text}
                                    </p>
                                </div>
                            </article>
                        ))
                    )}
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
                <div className="w-full h-full bg-white rounded-2xl"></div>
            </section>
        </div>
    );
};

export default BoxChat;
