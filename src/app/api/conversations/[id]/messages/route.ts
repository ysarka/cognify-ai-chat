import { NextResponse } from 'next/server';
import { chatStore, getNextMessageId } from '@/server/db';
import { requestLlmReply } from '@/server/openrouter';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const exists = chatStore.conversations.some((conversation) => conversation.id === id);

    if (!exists) {
        return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    return NextResponse.json(chatStore.messages.filter((message) => message.conversationId === id));
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const conversation = chatStore.conversations.find((item) => item.id === id);

    if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    try {
        const body = await request.json();
        const content = typeof body?.content === 'string' ? body.content.trim() : '';

        if (!content) {
            return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
        }

        const userMessage = {
            id: getNextMessageId(),
            conversationId: id,
            role: 'user' as const,
            content,
        };

        chatStore.messages.push(userMessage);

        const history = chatStore.messages
            .filter((message) => message.conversationId === id)
            .map((message) => ({
                role: message.role,
                content: message.content,
            }));

        let assistantContent: string;

        try {
            assistantContent = await requestLlmReply(history);
        } catch {
            assistantContent = 'Sorry, I could not reach OpenRouter. Check your API key and try again.';
        }

        const assistantMessage = {
            id: getNextMessageId(),
            conversationId: id,
            role: 'assistant' as const,
            content: assistantContent,
        };

        chatStore.messages.push(assistantMessage);

        if (conversation.title === 'New Chat') {
            conversation.title = content.slice(0, 30) || 'New Chat';
        }

        return NextResponse.json({ userMessage, assistantMessage }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Could not send the message.' }, { status: 400 });
    }
}
