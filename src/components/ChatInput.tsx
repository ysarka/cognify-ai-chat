'use client';

export default function ChatInput({
    value,
    onChange,
    onSubmit,
    disabled,
}: {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    disabled: boolean;
}) {
    return (
        <form onSubmit={onSubmit} className="border-t border-gray-200 bg-white p-4">
            <div className="mx-auto flex max-w-3xl items-end gap-2">
                <textarea
                    rows={1}
                    placeholder="Message AI..."
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    disabled={disabled}
                    className="max-h-40 flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                />

                <button
                    type="submit"
                    disabled={disabled}
                    className="rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Send
                </button>
            </div>
        </form>
    );
}
