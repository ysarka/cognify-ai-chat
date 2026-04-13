export default function MessageBubble({ role, text }: { role: 'user' | 'assistant'; text: string }) {
    const isUser = role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm md:max-w-[70%] ${
                    isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                }`}
            >
                {text}
            </div>
        </div>
    );
}
