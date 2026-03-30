function ConversationItem({ conversation, isActive, onSelectConversation }) {
    const className = isActive
        ? 'block w-full rounded-lg bg-gray-700 px-3 py-2 text-left'
        : 'block w-full rounded-lg px-3 py-2 text-left hover:bg-gray-700';

    return (
        <button type="button" onClick={() => onSelectConversation(conversation.id)} className={className}>
            {conversation.title}
        </button>
    );
}

export default ConversationItem;
