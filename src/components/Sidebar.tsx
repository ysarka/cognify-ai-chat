'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { createConversation, deleteConversation, getConversations } from '@/lib/api';
import ConversationList from './ConversationList';
import NewChatButton from './NewChatButton';

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();

    const activeConversationId = pathname?.startsWith('/chat/') ? pathname.split('/')[2] : undefined;

    const { data: conversations = [], error } = useQuery({
        queryKey: ['conversations'],
        queryFn: getConversations,
    });

    const createConversationMutation = useMutation({
        mutationFn: () => createConversation('New Chat'),
        onSuccess: async (conversation) => {
            await queryClient.invalidateQueries({ queryKey: ['conversations'] });
            router.push(`/chat/${conversation.id}`);
        },
    });

    const deleteConversationMutation = useMutation({
        mutationFn: (conversationId: string) => deleteConversation(conversationId),
        onSuccess: async (_data, deletedConversationId) => {
            await queryClient.invalidateQueries({ queryKey: ['conversations'] });

            if (activeConversationId === deletedConversationId) {
                const remainingConversations = conversations.filter(
                    (conversation) => conversation.id !== deletedConversationId,
                );

                if (remainingConversations.length > 0) {
                    router.push(`/chat/${remainingConversations[0].id}`);
                } else {
                    const newConversation = await createConversationMutation.mutateAsync();
                    router.push(`/chat/${newConversation.id}`);
                }
            }
        },
    });

    const sidebarError =
        error instanceof Error
            ? error.message
            : createConversationMutation.error instanceof Error
              ? createConversationMutation.error.message
              : deleteConversationMutation.error instanceof Error
                ? deleteConversationMutation.error.message
                : '';

    return (
        <aside className="flex w-full flex-col border-b border-gray-800 bg-gray-900 text-white md:w-72 md:border-b-0 md:border-r">
            <div className="border-b border-gray-800 p-4">
                <NewChatButton
                    onClick={() => createConversationMutation.mutate()}
                    disabled={createConversationMutation.isPending}
                />
                {sidebarError ? <p className="mt-3 text-sm text-red-300">{sidebarError}</p> : null}
            </div>

            <ConversationList
                conversations={conversations}
                activeConversationId={activeConversationId}
                onDelete={(conversationId) => deleteConversationMutation.mutate(conversationId)}
                deletingConversationId={deleteConversationMutation.variables}
            />
        </aside>
    );
}
