import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const existingConversation = await prisma.conversation.findUnique({
        where: { id },
        select: { id: true },
    });

    if (!existingConversation) {
        return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    await prisma.conversation.delete({
        where: { id },
    });

    return new NextResponse(null, { status: 204 });
}
