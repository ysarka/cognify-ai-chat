import ChatPanel from '@/components/ChatPanel';

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return <ChatPanel activeConversationId={id} />;
}
