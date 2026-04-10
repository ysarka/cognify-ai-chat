import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function ChatIndexPage() {
    let conversation = await prisma.conversation.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
    });

    if (!conversation) {
        conversation = await prisma.conversation.create({
            data: { title: 'New Chat' },
            select: { id: true },
        });
    }

    redirect(`/chat/${conversation.id}`);
}
