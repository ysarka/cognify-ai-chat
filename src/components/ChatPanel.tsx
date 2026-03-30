'use client';

import { useEffect, useState } from 'react';
import type { Message } from '@/types/chat';
import { getMessages, sendMessage } from '@/lib/api';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';

export default function ChatPanel({ activeConversationId }: { activeConversationId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let ignore = false;

        async function loadMessages() {
            try {
                setError('');
                const data = await getMessages(activeConversationId);

                if (!ignore) {
                    setMessages(data);
                }
            } catch (err) {
                if (!ignore) {
                    setMessages([]);
                    setError(err instanceof Error ? err.message : 'Could not load messages.');
                }
            }
        }

        loadMessages();

        return () => {
            ignore = true;
        };
    }, [activeConversationId]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedInput = input.trim();

        if (!trimmedInput || isLoading) {
            return;
        }

        const optimisticUserMessage: Message = {
            id: `temp-${Date.now()}`,
            conversationId: activeConversationId,
            role: 'user',
            content: trimmedInput,
        };

        setInput('');
        setError('');
        setMessages((current) => [...current, optimisticUserMessage]);
        setIsLoading(true);

        try {
            const response = await sendMessage(activeConversationId, trimmedInput);

            setMessages((current) => [
                ...current.filter((message) => message.id !== optimisticUserMessage.id),
                response.userMessage,
                response.assistantMessage,
            ]);
        } catch (err) {
            setMessages((current) => current.filter((message) => message.id !== optimisticUserMessage.id));

            setError(err instanceof Error ? err.message : 'Could not send the message.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="flex min-h-screen flex-1 flex-col bg-white">
            <header className="border-b border-gray-200 px-6 py-4">
                <h1 className="text-lg font-semibold text-gray-900">Conversation {activeConversationId}</h1>
            </header>

            {error ? <div className="px-6 pt-4 text-sm text-red-600">{error}</div> : null}

            <MessageList messages={messages} />
            {isLoading ? <LoadingIndicator /> : null}

            <ChatInput value={input} onChange={setInput} onSubmit={handleSubmit} disabled={isLoading} />
        </section>
    );
}
