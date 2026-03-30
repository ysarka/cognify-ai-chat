function MessageBubble({ role, text }) {
    const isUser = role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[60%] rounded-2xl px-4 py-2 ${
                    isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                }`}
            >
                {text}
            </div>
        </div>
    );
}

export default MessageBubble;
