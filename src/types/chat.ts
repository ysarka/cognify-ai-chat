export type Role = 'user' | 'assistant';

export interface Conversation {
    id: string;
    title: string;
}

export interface Message {
    id: string;
    conversationId: string;
    role: Role;
    content: string;
}
