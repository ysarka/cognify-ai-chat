function NewChatButton({ onClick }) {
    return (
        <button type="button" onClick={onClick} className="w-full rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-500">
            + New Chat
        </button>
    );
}

export default NewChatButton;
