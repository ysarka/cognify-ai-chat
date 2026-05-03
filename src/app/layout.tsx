import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from './providers';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
    title: 'Cognify AI Chat',
    description: 'Next.js chat app with TanStack Query and Prisma',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Cognify',
    },
    icons: {
        icon: '/icon-192.png',
        apple: '/apple-touch-icon.png',
    },
};

export const viewport: Viewport = {
    themeColor: '#111827',
    viewportFit: 'cover',
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
                <ServiceWorkerRegister />
            </body>
        </html>
    );
}
