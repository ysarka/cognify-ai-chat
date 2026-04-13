import { NextResponse } from 'next/server';
import { getConversation } from '@/server/conversations';
import { listMessages } from '@/server/messages';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const conversation = await getConversation(id);

    if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    const messages = await listMessages(id);

    return NextResponse.json(messages);
}
