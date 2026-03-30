import Sidebar from '@/components/Sidebar';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <Sidebar />
            <main className="flex-1 bg-white">{children}</main>
        </div>
    );
}
