import { prisma } from '@/lib/prisma';
import type { Conversation } from '@/types/chat';

export async function listConversations(): Promise<Conversation[]> {
    return prisma.conversation.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
        },
    });
}

export async function getConversation(conversationId: string): Promise<Conversation | null> {
    return prisma.conversation.findUnique({
        where: { id: conversationId },
        select: {
            id: true,
            title: true,
        },
    });
}

export async function getLatestConversation(): Promise<Conversation | null> {
    return prisma.conversation.findFirst({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
        },
    });
}

export async function createConversation(title = 'New Chat'): Promise<Conversation> {
    const trimmedTitle = title.trim() || 'New Chat';

    return prisma.conversation.create({
        data: { title: trimmedTitle },
        select: {
            id: true,
            title: true,
        },
    });
}

export async function deleteConversation(conversationId: string): Promise<void> {
    await prisma.conversation.delete({
        where: { id: conversationId },
    });
}

export async function updateConversationTitleIfNeeded(
    conversationId: string,
    currentTitle: string,
    nextTitleSource: string,
): Promise<void> {
    if (currentTitle !== 'New Chat') {
        return;
    }

    const nextTitle = nextTitleSource.trim().slice(0, 30) || 'New Chat';

    await prisma.conversation.update({
        where: { id: conversationId },
        data: {
            title: nextTitle,
        },
    });
}
