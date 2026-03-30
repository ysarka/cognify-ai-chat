import { useEffect, useState } from 'react';
import Sidebar from './components/sidebar/Sidebar.jsx';
import ChatPanel from './components/chat/ChatPanel.jsx';
import { createConversation } from './api/conversations.js';
import { createMessage, getMessagesByConversationId } from './api/messages.js';
import { requestLlmReply } from './api/llm.js';

function App() {
    const [activeConversationId, setActiveConversationId] = useState('conv-1');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);

    useEffect(() => {
        let isCancelled = false;

        async function loadMessages() {
            if (!activeConversationId) {
                return;
            }

            const loadedMessages = await getMessagesByConversationId(activeConversationId);

            if (!isCancelled) {
                setMessages(loadedMessages);
            }
        }

        loadMessages();

        return () => {
            isCancelled = true;
        };
    }, [activeConversationId]);

    async function handleSelectConversation(conversationId) {
        setActiveConversationId(conversationId);
    }

    async function handleNewChat() {
        const newConversation = await createConversation('New Chat');
        setActiveConversationId(newConversation.id);
        setMessages([]);
        setSidebarRefreshKey((prev) => prev + 1);
    }

    async function handleSendMessage(text) {
        const trimmedText = text.trim();

        if (!trimmedText || !activeConversationId || isLoading) {
            return;
        }

        const conversationId = activeConversationId;

        const userMessage = await createMessage({
            conversationId,
            role: 'user',
            content: trimmedText,
        });

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const historyForApi = [...messages, userMessage].map((message) => ({
                role: message.role,
                content: message.content,
            }));

            const assistantReply = await requestLlmReply(historyForApi);

            const assistantMessage = await createMessage({
                conversationId,
                role: 'assistant',
                content: assistantReply,
            });

            if (conversationId === activeConversationId) {
                setMessages((prev) => [...prev, assistantMessage]);
            }
        } catch {
            const fallbackMessage = await createMessage({
                conversationId,
                role: 'assistant',
                content: 'Sorry, I could not reach OpenRouter. Check your API key and try again.',
            });

            if (conversationId === activeConversationId) {
                setMessages((prev) => [...prev, fallbackMessage]);
            }
        } finally {
            if (conversationId === activeConversationId) {
                setIsLoading(false);
            }
        }
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
                onNewChat={handleNewChat}
                refreshKey={sidebarRefreshKey}
            />

            <ChatPanel messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
        </div>
    );
}

export default App;
