import { prisma } from '@/lib/prisma';
import type { Message, Role } from '@/types/chat';

export async function listMessages(conversationId: string): Promise<Message[]> {
    return prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        select: {
            id: true,
            conversationId: true,
            role: true,
            content: true,
        },
    }) as Promise<Message[]>;
}

export async function createMessage(conversationId: string, role: Role, content: string): Promise<Message> {
    return prisma.message.create({
        data: {
            conversationId,
            role,
            content,
        },
        select: {
            id: true,
            conversationId: true,
            role: true,
            content: true,
        },
    }) as Promise<Message>;
}

export async function createUserMessage(conversationId: string, content: string): Promise<Message> {
    return createMessage(conversationId, 'user', content);
}

export async function createAssistantMessage(conversationId: string, content: string): Promise<Message> {
    return createMessage(conversationId, 'assistant', content);
}
