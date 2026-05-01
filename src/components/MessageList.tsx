'use client';

import { useEffect, useRef } from 'react';
import type { UIMessage } from 'ai';
import MessageBubble from './MessageBubble';

function getMessageText(message: UIMessage) {
    return message.parts
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('');
}

export default function MessageList({ messages }: { messages: UIMessage[] }) {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <section className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    role={message.role === 'user' ? 'user' : 'assistant'}
                    text={getMessageText(message)}
                />
            ))}
            <div ref={bottomRef} />
        </section>
    );
}
