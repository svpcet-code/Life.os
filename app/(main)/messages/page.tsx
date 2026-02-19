'use client';
import { useState, useEffect, FormEvent } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Lock, Unlock, Send } from 'lucide-react';

interface Message {
    id: string;
    content: string;
    unlockAt: string;
    isLocked: boolean;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => { fetchMessages(); }, []);

    async function fetchMessages() {
        const res = await fetch('/api/messages');
        if (res.ok) setMessages(await res.json());
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, unlockAt: new Date(date).toISOString() })
        });
        setContent('');
        setDate('');
        fetchMessages();
    }

    return (
        <div className="p-8 pt-24 mx-auto max-w-6xl space-y-6">
            <h1 className="text-3xl font-bold text-white">Time Capsule</h1>

            <div className="grid gap-6 lg:grid-cols-3">
                <GlassCard className="lg:col-span-1 h-fit">
                    <h3 className="text-xl font-semibold mb-4 text-white">Send to Future</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white focus:border-indigo-500/50 outline-none h-32"
                            placeholder="Message to your future self..."
                            required
                        />
                        <div>
                            <label className="text-xs text-gray-400 uppercase mb-1 block">Unlock Date</label>
                            <input
                                type="datetime-local"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white focus:border-indigo-500/50 outline-none  [&::-webkit-calendar-picker-indicator]:invert"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full flex justify-center items-center gap-2 rounded-lg bg-indigo-600 py-3 font-medium hover:bg-indigo-500">
                            <Send size={18} /> Seal Capsule
                        </button>
                    </form>
                </GlassCard>

                <div className="lg:col-span-2 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 py-10">No capsules found. Send one!</div>
                    )}
                    {messages.map(msg => (
                        <GlassCard key={msg.id} className={msg.isLocked ? 'border-orange-500/20' : 'border-green-500/20'}>
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-full ${msg.isLocked ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                                    {msg.isLocked ? <Lock size={20} /> : <Unlock size={20} />}
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">
                                        {msg.isLocked ? `Unlocks on ${new Date(msg.unlockAt).toLocaleDateString()}` : `Unlocked on ${new Date(msg.unlockAt).toLocaleDateString()}`}
                                    </div>
                                    <p className={`text-lg ${msg.isLocked ? 'blur-sm select-none text-gray-500' : 'text-white'}`}>
                                        {msg.content}
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
