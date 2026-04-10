const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = 'openai/gpt-4o-mini';

export async function requestLlmReply(messages: Array<{ role: string; content: string }>) {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        throw new Error('Missing OPENROUTER_API_KEY. Add it to .env.local.');
    }

    const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: MODEL_NAME,
            messages,
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenRouter request failed: ${response.status}`);
    }

    const data = await response.json();

    return data.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a reply.';
}
