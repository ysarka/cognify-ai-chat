import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const conversations = await prisma.conversation.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
        },
    });

    return NextResponse.json(conversations);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const title = typeof body?.title === 'string' && body.title.trim() ? body.title.trim() : 'New Chat';

        const conversation = await prisma.conversation.create({
            data: { title },
            select: {
                id: true,
                title: true,
            },
        });

        return NextResponse.json(conversation, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Could not create the conversation.' }, { status: 400 });
    }
}
