import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1';
const MODEL_NAME = 'openai/gpt-4o-mini';

const openrouter = createOpenAICompatible({
    name: 'openrouter',
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: OPENROUTER_URL,
});

export function getOpenRouterModel() {
    if (!process.env.OPENROUTER_API_KEY) {
        throw new Error('Missing OPENROUTER_API_KEY. Add it to .env.local.');
    }

    return openrouter(MODEL_NAME);
}
