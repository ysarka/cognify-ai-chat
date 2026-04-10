import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <div className="max-w-xl rounded-2xl bg-white p-8 shadow-sm">
                <h1 className="text-3xl font-semibold text-gray-900">Welcome to Cognify AI Chat</h1>

                <p className="mt-3 text-gray-600">
                    This Next.js version uses App Router, local API routes, and server-side environment variables.
                </p>

                <Link
                    href="/chat/conv-1"
                    className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
                >
                    Open Chat
                </Link>
            </div>
        </main>
    );
}
