import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { getConversation, updateConversationTitleIfNeeded } from '@/server/conversations';
import { createAssistantMessage, createUserMessage } from '@/server/messages';
import { getOpenRouterModel } from '@/server/openrouter';

function getTextFromMessage(message: UIMessage) {
    return message.parts
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('')
        .trim();
}

export async function POST(request: Request) {
    try {
        const {
            messages,
            conversationId,
        }: {
            messages?: UIMessage[];
            conversationId?: string;
        } = await request.json();

        if (!conversationId) {
            return Response.json({ error: 'Conversation ID is required.' }, { status: 400 });
        }

        if (!messages?.length) {
            return Response.json({ error: 'At least one message is required.' }, { status: 400 });
        }

        const conversation = await getConversation(conversationId);

        if (!conversation) {
            return Response.json({ error: 'Conversation not found.' }, { status: 404 });
        }

        const userMessage = [...messages].reverse().find((message) => message.role === 'user');

        const userContent = userMessage ? getTextFromMessage(userMessage) : '';

        if (!userContent) {
            return Response.json({ error: 'User message content is required.' }, { status: 400 });
        }

        await createUserMessage(conversationId, userContent);
        await updateConversationTitleIfNeeded(conversationId, conversation.title, userContent);

        const result = streamText({
            model: getOpenRouterModel(),
            messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({
            originalMessages: messages,
            async onFinish({ responseMessage, isAborted }) {
                if (isAborted) {
                    return;
                }

                const assistantContent = getTextFromMessage(responseMessage);

                if (!assistantContent) {
                    return;
                }

                await createAssistantMessage(conversationId, assistantContent);
            },
            onError() {
                return 'Failed to generate a reply.';
            },
        });
    } catch {
        return Response.json({ error: 'Could not send the message.' }, { status: 400 });
    }
}
