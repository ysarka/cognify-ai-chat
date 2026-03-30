import { getNextMessageId, messagesDb } from './db.js';

function delay(ms = 150) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export async function getMessagesByConversationId(conversationId) {
    await delay();

    return messagesDb.filter((message) => message.conversationId === conversationId);
}

export async function createMessage({ conversationId, role, content }) {
    await delay();

    const newMessage = {
        id: getNextMessageId(),
        conversationId,
        role,
        content,
    };

    messagesDb.push(newMessage);
    return newMessage;
}
