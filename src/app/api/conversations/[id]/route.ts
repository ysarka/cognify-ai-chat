import { NextResponse } from 'next/server';
import { deleteConversation, getConversation } from '@/server/conversations';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const conversation = await getConversation(id);

    if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    await deleteConversation(id);

    return NextResponse.json({ ok: true });
}
