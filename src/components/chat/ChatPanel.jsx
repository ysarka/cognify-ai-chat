import { useState } from 'react';
import MessageList from './MessageList.jsx';
import ChatInput from './ChatInput.jsx';
import LoadingIndicator from './LoadingIndicator.jsx';

function ChatPanel({ messages, isLoading, onSendMessage }) {
    const [input, setInput] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        const trimmedInput = input.trim();

        if (!trimmedInput || isLoading) {
            return;
        }

        setInput('');
        await onSendMessage(trimmedInput);
    }

    return (
        <main className="flex flex-1 flex-col bg-white">
            <MessageList messages={messages} />
            {isLoading ? <LoadingIndicator /> : null}
            <ChatInput value={input} onChange={setInput} onSubmit={handleSubmit} disabled={isLoading} />
        </main>
    );
}

export default ChatPanel;
