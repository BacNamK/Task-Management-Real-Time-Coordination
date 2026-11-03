import { type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { Send, X } from 'lucide-react';
import type { ChatMessage } from './chatMessage.type';

type ChatMessageComposerProps = {
    message: string;
    replyTo: ChatMessage | null;
    onMessageChange: (message: string) => void;
    onCancelReply: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const ChatMessageComposer = ({
    message,
    replyTo,
    onMessageChange,
    onCancelReply,
    onSubmit,
}: ChatMessageComposerProps) => {
    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    };

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        onMessageChange(event.target.value);
    };

    return (
        <form onSubmit={onSubmit} className="shrink-0 p-3 sm:p-4">
            {replyTo && (
                <div className="mb-2 flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
                    <span className="min-w-0 truncate">
                        Replying to: {replyTo.text}
                    </span>
                    <button
                        type="button"
                        onClick={onCancelReply}
                        aria-label="Cancel reply"
                        className="ml-2 shrink-0 rounded p-1 hover:bg-slate-200"
                    >
                        <X size={16} aria-hidden="true" />
                    </button>
                </div>
            )}
            <label htmlFor="chat-message" className="sr-only">
                Type a message
            </label>
            <div className="flex items-end gap-2 border-b-2 p-0.5 transition ">
                <textarea
                    id="chat-message"
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
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
    );
};

export default ChatMessageComposer;
