'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Conversation } from '@/types/chat';
import {
    useConversationsQuery,
    useCreateConversationMutation,
    useDeleteConversationMutation,
} from '@/hooks/useConversations';
import ConversationList from './ConversationList';
import NewChatButton from './NewChatButton';

export default function SidebarClient({ initialConversations }: { initialConversations: Conversation[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarError, setSidebarError] = useState('');

    const { data: conversations = [] } = useConversationsQuery(initialConversations);

    const createConversationMutation = useCreateConversationMutation();
    const deleteConversationMutation = useDeleteConversationMutation();

    const activeConversationId = useMemo(() => {
        return pathname?.startsWith('/chat/') ? pathname.split('/')[2] : undefined;
    }, [pathname]);

    async function handleCreateConversation() {
        setSidebarError('');

        try {
            const createdConversation = await createConversationMutation.mutateAsync('New Chat');

            router.push(`/chat/${createdConversation.id}`);
            router.refresh();
        } catch (error) {
            setSidebarError(error instanceof Error ? error.message : 'Could not create the conversation.');
        }
    }

    async function handleDeleteConversation(conversationId: string) {
        setSidebarError('');

        try {
            const currentConversations = conversations;
            const remainingConversations = currentConversations.filter(
                (conversation) => conversation.id !== conversationId,
            );
            const nextConversationId = remainingConversations[0]?.id;

            await deleteConversationMutation.mutateAsync(conversationId);

            if (activeConversationId === conversationId) {
                if (nextConversationId) {
                    router.push(`/chat/${nextConversationId}`);
                } else {
                    router.push('/chat');
                }
            }

            router.refresh();
        } catch (error) {
            setSidebarError(error instanceof Error ? error.message : 'Could not delete the conversation.');
        }
    }

    return (
        <>
            <div className="border-b border-gray-800 p-4">
                <NewChatButton onClick={handleCreateConversation} disabled={createConversationMutation.isPending} />
                {sidebarError ? <p className="mt-3 text-sm text-red-300">{sidebarError}</p> : null}
            </div>

            <ConversationList
                conversations={conversations}
                activeConversationId={activeConversationId}
                onDelete={handleDeleteConversation}
                deletingConversationId={
                    deleteConversationMutation.isPending ? deleteConversationMutation.variables : undefined
                }
            />
        </>
    );
}
