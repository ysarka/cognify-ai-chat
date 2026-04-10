'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';

export default function MessageList({ messages }: { messages: Message[] }) {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <section className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.map((message) => (
                <MessageBubble key={message.id} role={message.role} text={message.content} />
            ))}
            <div ref={bottomRef} />
        </section>
    );
}
