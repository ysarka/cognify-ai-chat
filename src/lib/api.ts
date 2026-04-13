import type { Conversation } from '@/types/chat';

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const response = await fetch(input, init);

    let data: unknown = null;

    try {
        data = await response.json();
    } catch {}

    if (!response.ok) {
        const message =
            data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
                ? data.error
                : 'Request failed.';

        throw new Error(message);
    }

    return data as T;
}

export function createConversation(title: string) {
    return fetchJson<Conversation>('/api/conversations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
    });
}

export async function deleteConversation(conversationId: string) {
    const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        let data: unknown = null;

        try {
            data = await response.json();
        } catch {}

        const message =
            data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
                ? data.error
                : 'Could not delete the conversation.';

        throw new Error(message);
    }
}
