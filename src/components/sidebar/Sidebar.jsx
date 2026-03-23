import { useEffect, useState } from 'react';
import { getConversations } from '../../api/conversations.js';
import NewChatButton from './NewChatButton.jsx';
import ConversationList from './ConversationList.jsx';

function Sidebar({ activeConversationId, onSelectConversation, onNewChat, refreshKey }) {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        let isCancelled = false;

        async function loadConversations() {
            const loadedConversations = await getConversations();

            if (!isCancelled) {
                setConversations(loadedConversations);
            }
        }

        loadConversations();

        return () => {
            isCancelled = true;
        };
    }, [refreshKey]);

    return (
        <aside className="hidden w-64 flex-shrink-0 flex-col bg-gray-900 text-white md:flex">
            <div className="border-b border-gray-700 p-4">
                <NewChatButton onClick={onNewChat} />
            </div>

            <ConversationList
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={onSelectConversation}
            />
        </aside>
    );
}

export default Sidebar;
