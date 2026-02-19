import { Sidebar } from '@/components/Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#0a0a0a] to-[#0a0a0a] text-white">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
