'use client';

import Link from 'next/link';
import type { Conversation } from '@/types/chat';

export default function ConversationItem({
    conversation,
    isActive,
    onDelete,
    isDeleting,
}: {
    conversation: Conversation;
    isActive: boolean;
    onDelete: (id: string) => void;
    isDeleting: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                isActive ? 'bg-gray-700 text-white' : 'text-gray-200 hover:bg-gray-800'
            }`}
        >
            <Link href={`/chat/${conversation.id}`} className="min-w-0 flex-1 truncate">
                {conversation.title}
            </Link>

            <button
                type="button"
                aria-label={`Delete ${conversation.title}`}
                onClick={() => onDelete(conversation.id)}
                disabled={isDeleting}
                className="rounded-md px-2 py-1 text-xs text-gray-300 transition hover:bg-gray-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
                Delete
            </button>
        </div>
    );
}
