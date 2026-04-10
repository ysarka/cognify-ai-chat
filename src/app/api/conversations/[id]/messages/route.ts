import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requestLlmReply } from '@/server/openrouter';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const conversation = await prisma.conversation.findUnique({
        where: { id },
        select: { id: true },
    });

    if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
        where: { conversationId: id },
        orderBy: { createdAt: 'asc' },
        select: {
            id: true,
            conversationId: true,
            role: true,
            content: true,
        },
    });

    return NextResponse.json(messages);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const conversation = await prisma.conversation.findUnique({
        where: { id },
        select: { id: true, title: true },
    });

    if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    try {
        const body = await request.json();
        const content = typeof body?.content === 'string' ? body.content.trim() : '';

        if (!content) {
            return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
        }

        const userMessage = await prisma.message.create({
            data: {
                conversationId: id,
                role: 'user',
                content,
            },
            select: {
                id: true,
                conversationId: true,
                role: true,
                content: true,
            },
        });

        const history = await prisma.message.findMany({
            where: { conversationId: id },
            orderBy: { createdAt: 'asc' },
            select: {
                role: true,
                content: true,
            },
        });

        let assistantContent: string;

        try {
            assistantContent = await requestLlmReply(history);
        } catch {
            assistantContent = 'Sorry, I could not reach OpenRouter. Check your API key and try again.';
        }

        const assistantMessage = await prisma.message.create({
            data: {
                conversationId: id,
                role: 'assistant',
                content: assistantContent,
            },
            select: {
                id: true,
                conversationId: true,
                role: true,
                content: true,
            },
        });

        if (conversation.title === 'New Chat') {
            await prisma.conversation.update({
                where: { id },
                data: {
                    title: content.slice(0, 30) || 'New Chat',
                },
            });
        }

        return NextResponse.json({ userMessage, assistantMessage }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Could not send the message.' }, { status: 400 });
    }
}
