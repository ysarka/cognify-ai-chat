import { OPENROUTER_KEY } from './config.js';

export async function streamChat(messages, onDelta) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENROUTER_KEY}`,
        },
        body: JSON.stringify({
            model: 'openai/gpt-4o-mini',
            messages: messages,
            stream: true,
        }),
    });

    const reader = response.body.getReader();

    const decoder = new TextDecoder();

    let done = false;
    let assistantText = '';

    while (!done) {
        const { value, done: readerDone } = await reader.read();

        done = readerDone;

        const chunk = decoder.decode(value, { stream: true });

        const lines = chunk.split('\n');

        for (const line of lines) {
            if (!line.startsWith('data:')) continue;

            const json = line.replace('data: ', '').trim();

            if (json === '[DONE]') continue;

            try {
                const data = JSON.parse(json);

                const delta = data.choices?.[0]?.delta?.content;

                if (delta) {
                    assistantText += delta;

                    onDelta(delta);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
    }

    return assistantText;
}
