"use client";

export function Footer() {
    return (
        <footer className="relative z-10 py-8 px-6 mt-auto">
            <div className="max-w-7xl mx-auto">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent mb-8" />
                <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 gap-4">
                    <p className="font-mono">© {new Date().getFullYear()} Life.OS</p>
                    <p className="italic text-gray-400">"Memories are the architecture of our soul."</p>
                    <div className="flex gap-4">
                        <span className="hover:text-accent-primary cursor-pointer transition-colors">Privacy</span>
                        <span className="hover:text-accent-primary cursor-pointer transition-colors">Terms</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
