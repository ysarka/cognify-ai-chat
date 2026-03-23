const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = 'openai/gpt-4o-mini';

// Create a .env.local file in the project root with:
// VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function requestLlmReply(messages) {
    if (!API_KEY) {
        throw new Error('Missing VITE_OPENROUTER_API_KEY. Add it to .env.local.');
    }

    const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
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
