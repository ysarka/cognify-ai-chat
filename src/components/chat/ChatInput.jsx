function ChatInput({ value, onChange, onSubmit, disabled }) {
    return (
        <form onSubmit={onSubmit} className="border-t bg-white p-4">
            <div className="mx-auto flex max-w-3xl items-end gap-2">
                <textarea
                    rows="1"
                    placeholder="Message AI..."
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    disabled={disabled}
                    className="flex-1 resize-none rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                ></textarea>

                <button
                    type="submit"
                    disabled={disabled}
                    className="flex-shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Send
                </button>
            </div>
        </form>
    );
}

export default ChatInput;
