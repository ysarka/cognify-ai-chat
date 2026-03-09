const form = document.getElementById('messages-form');
const input = document.getElementById('messages-form-input');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const userMessage = input.value;
    displayMessage(userMessage, 'user');
    input.value = '';
    const assistantResponse = getAssistantResponse(userMessage);
    displayMessage(assistantResponse, 'assistant');
});

function displayMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `message-${sender}`);
    messageDiv.textContent = message;
    document.getElementById('messages-history').appendChild(messageDiv);
}

function getAssistantResponse(userMessage) {
    return `You said: ${userMessage}`;
}
