import { listConversations } from '@/server/conversations';
import SidebarClient from './SidebarClient';

export default async function Sidebar() {
    const conversations = await listConversations();

    return (
        <aside className="flex w-full flex-col border-b border-gray-800 bg-gray-900 text-white md:w-72 md:border-r md:border-b-0">
            <SidebarClient initialConversations={conversations} />
        </aside>
    );
}
