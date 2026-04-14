'use client';
import { useState, useEffect, FormEvent } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calendar, Upload, CloudUpload, FileVideo, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [mediaUrls, setMediaUrls] = useState({ image: "", video: "" });

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
        const payload = { ...data, ...mediaUrls };

        await fetch('/api/memories', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });

        setShowForm(false);
        setMediaUrls({ image: "", video: "" });
        fetchMemories();
    }

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                if (file.type.startsWith("video/")) {
                    setMediaUrls(prev => ({ ...prev, video: data.url }));
                } else if (file.type.startsWith("image/")) {
                    setMediaUrls(prev => ({ ...prev, image: data.url }));
                }
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    };

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
                                {/* Drag and Drop Zone */}
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    className={cn(
                                        "relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer",
                                        isDragging ? "border-indigo-500 bg-indigo-500/10 scale-[0.98]" : "border-white/10 bg-white/5 hover:bg-white/10",
                                        uploading && "opacity-50 pointer-events-none"
                                    )}
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*,video/*';
                                        input.onchange = (e) => {
                                            const file = (e.target as HTMLInputElement).files?.[0];
                                            if (file) handleFileUpload(file);
                                        };
                                        input.click();
                                    }}
                                >
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        {mediaUrls.image && <div className="w-8 h-8 rounded bg-green-500/20 border border-green-500/50 flex items-center justify-center"><CloudUpload size={12} className="text-green-500" /></div>}
                                        {mediaUrls.video && <div className="w-8 h-8 rounded bg-blue-500/20 border border-blue-500/50 flex items-center justify-center"><FileVideo size={12} className="text-blue-500" /></div>}
                                    </div>

                                    {uploading ? (
                                        <Loader2 className="animate-spin text-indigo-500" size={24} />
                                    ) : (
                                        <Upload className={cn("text-gray-400 group-hover:text-white transition-colors", isDragging && "text-indigo-500 scale-110")} size={32} />
                                    )}
                                    <p className="text-sm font-medium text-gray-400">
                                        {uploading ? "Uploading media..." : "Drag & Drop or Click to Upload Media"}
                                    </p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Supports Images & Videos</p>
                                </div>

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
