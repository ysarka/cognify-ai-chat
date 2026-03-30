import { NextResponse } from 'next/server';
import { chatStore, getNextConversationId } from '@/server/db';

export async function GET() {
    return NextResponse.json(chatStore.conversations);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const title = typeof body?.title === 'string' && body.title.trim() ? body.title.trim() : 'New Chat';

        const conversation = {
            id: getNextConversationId(),
            title,
        };

        chatStore.conversations.unshift(conversation);

        return NextResponse.json(conversation, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Could not create the conversation.' }, { status: 400 });
    }
}
