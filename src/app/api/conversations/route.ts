import { NextResponse } from 'next/server';
import { createConversation, listConversations } from '@/server/conversations';

export async function GET() {
    const conversations = await listConversations();
    return NextResponse.json(conversations);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const title = typeof body?.title === 'string' ? body.title : 'New Chat';
        const conversation = await createConversation(title);

        return NextResponse.json(conversation, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Could not create the conversation.' }, { status: 400 });
    }
}
