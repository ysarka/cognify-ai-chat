import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
    title: 'Cognify AI Chat',
    description: 'Next.js chat app with TanStack Query and Prisma',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-gray-100 text-gray-900 antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
