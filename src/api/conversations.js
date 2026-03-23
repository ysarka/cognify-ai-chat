import { conversationsDb, getNextConversationId } from './db.js';

function delay(ms = 150) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export async function getConversations() {
    await delay();
    return [...conversationsDb];
}

export async function createConversation(title) {
    await delay();

    const newConversation = {
        id: getNextConversationId(),
        title,
    };

    conversationsDb.unshift(newConversation);
    return newConversation;
}
