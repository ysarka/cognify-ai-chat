'use client';

import type { Conversation } from '@/types/chat';
import ConversationItem from './ConversationItem';

export default function ConversationList({
    conversations,
    activeConversationId,
    onDelete,
    deletingConversationId,
}: {
    conversations: Conversation[];
    activeConversationId?: string;
    onDelete: (id: string) => void;
    deletingConversationId?: string;
}) {
    if (conversations.length === 0) {
        return <p className="px-2 text-sm text-gray-400">No conversations yet.</p>;
    }

    return (
        <nav className="flex-1 space-y-2 overflow-y-auto p-2">
            {conversations.map((conversation) => (
                <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={conversation.id === activeConversationId}
                    onDelete={onDelete}
                    isDeleting={deletingConversationId === conversation.id}
                />
            ))}
        </nav>
    );
}
