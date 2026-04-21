'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { Message } from '@/types/chat';
import { getConversations, getMessages, sendMessage } from '@/lib/api';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';

export default function ChatPanel({ activeConversationId }: { activeConversationId: string }) {
    const queryClient = useQueryClient();
    const [input, setInput] = useState('');
    const [error, setError] = useState('');

    const { data: messages = [] } = useQuery({
        queryKey: ['messages', activeConversationId],
        queryFn: () => getMessages(activeConversationId),
        enabled: Boolean(activeConversationId),
    });

    const { data: conversations = [] } = useQuery({
        queryKey: ['conversations'],
        queryFn: getConversations,
    });

    const activeConversationTitle = useMemo(() => {
        return conversations.find((conversation) => conversation.id === activeConversationId)?.title ?? 'New Chat';
    }, [activeConversationId, conversations]);

    const sendMessageMutation = useMutation({
        mutationFn: (content: string) => sendMessage(activeConversationId, content),
        onMutate: async (content) => {
            setError('');
            await queryClient.cancelQueries({ queryKey: ['messages', activeConversationId] });

            const previousMessages = queryClient.getQueryData<Message[]>(['messages', activeConversationId]) ?? [];

            const optimisticUserMessage: Message = {
                id: `temp-${Date.now()}`,
                conversationId: activeConversationId,
                role: 'user',
                content,
            };

            queryClient.setQueryData<Message[]>(
                ['messages', activeConversationId],
                [...previousMessages, optimisticUserMessage],
            );

            setInput('');

            return { previousMessages };
        },
        onError: (mutationError, _content, context) => {
            queryClient.setQueryData(['messages', activeConversationId], context?.previousMessages ?? []);
            setError(mutationError instanceof Error ? mutationError.message : 'Could not send the message.');
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['messages', activeConversationId] });
            await queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedInput = input.trim();

        if (!trimmedInput || sendMessageMutation.isPending) {
            return;
        }

        sendMessageMutation.mutate(trimmedInput);
    }

    return (
        <section className="flex min-h-screen flex-1 flex-col bg-white">
            <header className="border-b border-gray-200 px-6 py-4">
                <h1 className="text-lg font-semibold text-gray-900">{activeConversationTitle}</h1>
            </header>

            {error ? <div className="px-6 pt-4 text-sm text-red-600">{error}</div> : null}

            <MessageList messages={messages} />
            {sendMessageMutation.isPending ? <LoadingIndicator /> : null}

            <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                disabled={sendMessageMutation.isPending}
            />
        </section>
    );
}
