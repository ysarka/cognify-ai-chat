'use client';

import { DefaultChatTransport, type UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';

export default function ChatPanel({
    activeConversationId,
    activeConversationTitle,
    initialMessages,
}: {
    activeConversationId: string;
    activeConversationTitle: string;
    initialMessages: UIMessage[];
}) {
    const router = useRouter();
    const [input, setInput] = useState('');

    const { messages, sendMessage, status, error } = useChat({
        id: activeConversationId,
        messages: initialMessages,
        transport: new DefaultChatTransport({
            api: '/api/chat',
            body: {
                conversationId: activeConversationId,
            },
        }),
        onFinish: () => {
            router.refresh();
        },
    });

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedInput = input.trim();

        if (!trimmedInput || status !== 'ready') {
            return;
        }

        setInput('');
        await sendMessage({ text: trimmedInput });
    }

    const isPending = status === 'submitted' || status === 'streaming';

    return (
        <section className="flex min-h-screen flex-1 flex-col bg-white">
            <header className="border-b border-gray-200 px-6 py-4">
                <h1 className="text-lg font-semibold text-gray-900">{activeConversationTitle}</h1>
            </header>

            {error ? <div className="px-6 pt-4 text-sm text-red-600">{error.message}</div> : null}

            <MessageList messages={messages} />

            {status === 'submitted' || status === 'streaming' ? <LoadingIndicator /> : null}

            <ChatInput value={input} onChange={setInput} onSubmit={handleSubmit} disabled={isPending} />
        </section>
    );
}
