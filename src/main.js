import { appendMessage, appendDelta } from './chat.js';
import { streamChat } from './api.js';

const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');

const messages = [];

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    input.value = '';

    appendMessage(text, 'user');

    messages.push({
        role: 'user',
        content: text,
    });

    const assistantElement = appendMessage('', 'ai');

    const reply = await streamChat(messages, (delta) => {
        appendDelta(assistantElement, delta);
    });

    messages.push({
        role: 'assistant',
        content: reply,
    });
});
