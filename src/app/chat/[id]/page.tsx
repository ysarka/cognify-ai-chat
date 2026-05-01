import type { UIMessage } from 'ai';
import { notFound } from 'next/navigation';
import ChatPanel from '@/components/ChatPanel';
import { getConversation } from '@/server/conversations';
import { listMessages } from '@/server/messages';

function toUiMessages(messages: Awaited<ReturnType<typeof listMessages>>): UIMessage[] {
    return messages.map((message) => ({
        id: message.id,
        role: message.role,
        parts: [
            {
                type: 'text',
                text: message.content,
            },
        ],
    }));
}

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [conversation, messages] = await Promise.all([getConversation(id), listMessages(id)]);

    if (!conversation) {
        notFound();
    }

    return (
        <ChatPanel
            key={conversation.id}
            activeConversationId={conversation.id}
            activeConversationTitle={conversation.title}
            initialMessages={toUiMessages(messages)}
        />
    );
}
