import ConversationItem from './ConversationItem.jsx';

function ConversationList({ conversations, activeConversationId, onSelectConversation }) {
    return (
        <nav className="flex-1 space-y-2 overflow-y-auto p-2">
            {conversations.map((conversation) => (
                <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={conversation.id === activeConversationId}
                    onSelectConversation={onSelectConversation}
                />
            ))}
        </nav>
    );
}

export default ConversationList;
