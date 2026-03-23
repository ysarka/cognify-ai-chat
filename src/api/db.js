export const conversationsDb = [
    {
        id: 'conv-1',
        title: 'JavaScript Help',
    },
    {
        id: 'conv-2',
        title: 'CSS Tips',
    },
];

export const messagesDb = [
    {
        id: 'msg-1',
        conversationId: 'conv-1',
        role: 'assistant',
        content: 'Hello! What JavaScript topic do you want help with?',
    },
    {
        id: 'msg-2',
        conversationId: 'conv-1',
        role: 'user',
        content: 'Can you explain closures simply?',
    },
    {
        id: 'msg-3',
        conversationId: 'conv-1',
        role: 'assistant',
        content: 'A closure is a function that remembers variables from the place where it was created.',
    },
    {
        id: 'msg-4',
        conversationId: 'conv-2',
        role: 'assistant',
        content: 'Hi! Need help with styling or layout?',
    },
    {
        id: 'msg-5',
        conversationId: 'conv-2',
        role: 'user',
        content: 'How do I center items with flexbox?',
    },
    {
        id: 'msg-6',
        conversationId: 'conv-2',
        role: 'assistant',
        content: 'Use justify-content for the main axis and align-items for the cross axis.',
    },
];

let nextConversationNumber = 3;
let nextMessageNumber = 7;

export function getNextConversationId() {
    return `conv-${nextConversationNumber++}`;
}

export function getNextMessageId() {
    return `msg-${nextMessageNumber++}`;
}
