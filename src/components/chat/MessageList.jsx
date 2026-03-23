import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble.jsx';

function MessageList({ messages }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <section className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.map((message) => (
                <MessageBubble key={message.id} role={message.role} text={message.content} />
            ))}
            <div ref={bottomRef}></div>
        </section>
    );
}

export default MessageList;
