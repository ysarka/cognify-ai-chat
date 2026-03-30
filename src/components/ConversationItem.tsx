'use client';

import Link from 'next/link';
import type { Conversation } from '@/types/chat';

export default function ConversationItem({
    conversation,
    isActive,
}: {
    conversation: Conversation;
    isActive: boolean;
}) {
    return (
        <Link
            href={`/chat/${conversation.id}`}
            className={`block rounded-xl px-3 py-2 text-sm transition ${
                isActive ? 'bg-gray-700 text-white' : 'text-gray-200 hover:bg-gray-800'
            }`}
        >
            {conversation.title}
        </Link>
    );
}
