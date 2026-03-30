import ChatPanel from '@/components/ChatPanel';

export default function ChatPage({ params }: { params: { id: string } }) {
    return <ChatPanel activeConversationId={params.id} />;
}
