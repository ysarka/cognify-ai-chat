'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Conversation } from '@/types/chat';

const conversationsQueryKey = ['conversations'];

async function fetchConversations(): Promise<Conversation[]> {
    const response = await fetch('/api/conversations');

    if (!response.ok) {
        throw new Error('Could not load conversations.');
    }

    return response.json();
}

async function createConversationRequest(title: string): Promise<Conversation> {
    const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message =
            data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
                ? data.error
                : 'Could not create the conversation.';

        throw new Error(message);
    }

    return data as Conversation;
}

async function deleteConversationRequest(conversationId: string): Promise<void> {
    const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message =
            data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
                ? data.error
                : 'Could not delete the conversation.';

        throw new Error(message);
    }
}

export function useConversationsQuery(initialConversations: Conversation[]) {
    return useQuery({
        queryKey: conversationsQueryKey,
        queryFn: fetchConversations,
        initialData: initialConversations,
    });
}

export function useCreateConversationMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (title: string) => createConversationRequest(title),
        onMutate: async (title: string) => {
            await queryClient.cancelQueries({ queryKey: conversationsQueryKey });

            const previous = queryClient.getQueryData<Conversation[]>(conversationsQueryKey) ?? [];

            const optimisticConversation: Conversation = {
                id: `temp-${Date.now()}`,
                title: title.trim() || 'New Chat',
            };

            queryClient.setQueryData<Conversation[]>(conversationsQueryKey, [optimisticConversation, ...previous]);

            return {
                previous,
                optimisticConversationId: optimisticConversation.id,
            };
        },
        onError: (_error, _title, context) => {
            queryClient.setQueryData(conversationsQueryKey, context?.previous ?? []);
        },
        onSuccess: (createdConversation, _title, context) => {
            queryClient.setQueryData<Conversation[]>(conversationsQueryKey, (current = []) => {
                const withoutOptimistic = current.filter(
                    (conversation) => conversation.id !== context?.optimisticConversationId,
                );

                const alreadyExists = withoutOptimistic.some(
                    (conversation) => conversation.id === createdConversation.id,
                );

                if (alreadyExists) {
                    return withoutOptimistic;
                }

                return [createdConversation, ...withoutOptimistic];
            });
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: conversationsQueryKey,
            });
        },
    });
}

export function useDeleteConversationMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (conversationId: string) => deleteConversationRequest(conversationId),
        onMutate: async (conversationId: string) => {
            await queryClient.cancelQueries({ queryKey: conversationsQueryKey });

            const previous = queryClient.getQueryData<Conversation[]>(conversationsQueryKey) ?? [];

            const remaining = previous.filter((conversation) => conversation.id !== conversationId);

            const nextConversationId = remaining[0]?.id;

            queryClient.setQueryData<Conversation[]>(conversationsQueryKey, remaining);

            return {
                previous,
                nextConversationId,
            };
        },
        onError: (_error, _conversationId, context) => {
            queryClient.setQueryData(conversationsQueryKey, context?.previous ?? []);
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: conversationsQueryKey,
            });
        },
    });
}
