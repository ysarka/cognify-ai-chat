export class ChatMessage extends HTMLElement {
    connectedCallback() {
        const sender = this.getAttribute('sender');

        const align = sender === 'user' ? 'justify-end' : 'justify-start';

        const bubbleStyle = sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900';

        this.innerHTML = `
<div class="flex ${align}">
<div class="${bubbleStyle} rounded-2xl px-4 py-2 max-w-[60%]">
${this.textContent}
</div>
</div>
`;
    }
}

customElements.define('chat-message', ChatMessage);

export function appendMessage(text, sender) {
    const list = document.querySelector('.message-list');

    const msg = document.createElement('chat-message');

    msg.setAttribute('sender', sender);

    msg.textContent = text;

    list.appendChild(msg);

    list.scrollTop = list.scrollHeight;

    return msg;
}

export function appendDelta(element, delta) {
    const bubble = element.querySelector('div div');

    bubble.textContent += delta;

    const list = document.querySelector('.message-list');

    list.scrollTop = list.scrollHeight;
}
