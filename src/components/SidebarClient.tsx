'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Conversation } from '@/types/chat';
import { createConversation, deleteConversation } from '@/lib/api';
import ConversationList from './ConversationList';
import NewChatButton from './NewChatButton';

export default function SidebarClient({ initialConversations }: { initialConversations: Conversation[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const [conversations, setConversations] = useState(initialConversations);
    const [sidebarError, setSidebarError] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [deletingConversationId, setDeletingConversationId] = useState<string | undefined>();

    useEffect(() => {
        setConversations(initialConversations);
    }, [initialConversations]);

    const activeConversationId = useMemo(() => {
        return pathname?.startsWith('/chat/') ? pathname.split('/')[2] : undefined;
    }, [pathname]);

    async function handleCreateConversation() {
        const previousConversations = conversations;

        const optimisticConversation: Conversation = {
            id: `temp-${Date.now()}`,
            title: 'New Chat',
        };

        setSidebarError('');
        setIsCreating(true);
        setConversations((currentConversations) => [optimisticConversation, ...currentConversations]);

        try {
            const createdConversation = await createConversation('New Chat');

            setConversations((currentConversations) =>
                currentConversations.map((conversation) =>
                    conversation.id === optimisticConversation.id ? createdConversation : conversation,
                ),
            );

            router.push(`/chat/${createdConversation.id}`);
            router.refresh();
        } catch (error) {
            setConversations(previousConversations);
            setSidebarError(error instanceof Error ? error.message : 'Could not create the conversation.');
        } finally {
            setIsCreating(false);
        }
    }

    async function handleDeleteConversation(conversationId: string) {
        const previousConversations = conversations;
        const remainingConversations = conversations.filter((conversation) => conversation.id !== conversationId);
        const nextConversationId = remainingConversations[0]?.id;

        setSidebarError('');
        setDeletingConversationId(conversationId);
        setConversations(remainingConversations);

        try {
            await deleteConversation(conversationId);

            if (activeConversationId === conversationId) {
                if (nextConversationId) {
                    router.push(`/chat/${nextConversationId}`);
                } else {
                    router.push('/chat');
                }
            }

            router.refresh();
        } catch (error) {
            setConversations(previousConversations);
            setSidebarError(error instanceof Error ? error.message : 'Could not delete the conversation.');
        } finally {
            setDeletingConversationId(undefined);
        }
    }

    return (
        <>
            <div className="border-b border-gray-800 p-4">
                <NewChatButton onClick={handleCreateConversation} disabled={isCreating} />
                {sidebarError ? <p className="mt-3 text-sm text-red-300">{sidebarError}</p> : null}
            </div>

            <ConversationList
                conversations={conversations}
                activeConversationId={activeConversationId}
                onDelete={handleDeleteConversation}
                deletingConversationId={deletingConversationId}
            />
        </>
    );
}
