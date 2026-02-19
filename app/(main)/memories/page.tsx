'use client';
import { useState, useEffect, FormEvent } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calendar } from 'lucide-react';

interface Memory {
    id: string;
    title: string;
    description: string;
    mood: string;
    createdAt: string;
}

export default function MemoriesPage() {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchMemories();
    }, []);

    async function fetchMemories() {
        const res = await fetch('/api/memories');
        if (res.ok) setMemories(await res.json());
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        await fetch('/api/memories', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });

        setShowForm(false);
        fetchMemories();
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this memory?')) return;
        await fetch(`/api/memories?id=${id}`, { method: 'DELETE' });
        fetchMemories();
    }

    return (
        <div className="p-8 pt-24 mx-auto max-w-6xl space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Memory Vault</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium hover:bg-indigo-500 transition-colors"
                >
                    <Plus size={18} />
                    Add Memory
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <GlassCard>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input name="title" required placeholder="Memory Title" className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white focus:border-indigo-500/50 outline-none" />
                                <textarea name="description" rows={3} placeholder="What happened?" className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white focus:border-indigo-500/50 outline-none" />
                                <select name="mood" className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white focus:border-indigo-500/50 outline-none [&>option]:text-black">
                                    <option value="happy">Happy</option>
                                    <option value="excited">Excited</option>
                                    <option value="calm">Calm</option>
                                    <option value="neutral">Neutral</option>
                                    <option value="sad">Sad</option>
                                    <option value="anxious">Anxious</option>
                                </select>
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                    <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-2">Save</button>
                                </div>
                            </form>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {memories.map((memory, i) => (
                    <GlassCard key={memory.id} className="group hover:border-indigo-500/30 transition-colors">
                        <div className="flex justify-between items-start">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                 ${memory.mood === 'happy' ? 'bg-green-500/20 text-green-300' :
                                    memory.mood === 'sad' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'}`}>
                                {memory.mood}
                            </span>
                            <button onClick={() => handleDelete(memory.id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-white">{memory.title}</h3>
                        <p className="mt-2 text-sm text-gray-400 line-clamp-3">{memory.description}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                            <Calendar size={12} />
                            {new Date(memory.createdAt).toLocaleDateString()}
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
