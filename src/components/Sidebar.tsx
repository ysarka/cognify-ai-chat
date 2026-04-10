'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Conversation } from '@/types/chat';
import { createConversation, getConversations } from '@/lib/api';
import ConversationList from './ConversationList';
import NewChatButton from './NewChatButton';

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const activeConversationId = pathname?.startsWith('/chat/') ? pathname.split('/')[2] : undefined;

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let ignore = false;

        async function loadConversations() {
            try {
                setError('');
                const data = await getConversations();

                if (!ignore) {
                    setConversations(data);
                }
            } catch (err) {
                if (!ignore) {
                    setError(err instanceof Error ? err.message : 'Could not load conversations.');
                }
            }
        }

        loadConversations();

        return () => {
            ignore = true;
        };
    }, []);

    async function handleNewChat() {
        try {
            setIsCreating(true);
            setError('');

            const conversation = await createConversation('New Chat');
            setConversations((current) => [conversation, ...current]);

            router.push(`/chat/${conversation.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not create a new chat.');
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <aside className="flex w-full flex-col border-b border-gray-800 bg-gray-900 text-white md:w-72 md:border-b-0 md:border-r">
            <div className="border-b border-gray-800 p-4">
                <NewChatButton onClick={handleNewChat} disabled={isCreating} />
                {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
            </div>

            <ConversationList conversations={conversations} activeConversationId={activeConversationId} />
        </aside>
    );
}
