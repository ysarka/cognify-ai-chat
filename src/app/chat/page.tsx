import { redirect } from 'next/navigation';
import { createConversation, getLatestConversation } from '@/server/conversations';

export default async function ChatIndexPage() {
    let conversation = await getLatestConversation();

    if (!conversation) {
        conversation = await createConversation('New Chat');
    }

    redirect(`/chat/${conversation.id}`);
}
