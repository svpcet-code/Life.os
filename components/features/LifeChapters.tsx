"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { lifeChapters, LifeChapter } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";

const STORAGE_KEY = "lifeos_chapters";

interface ChapterForm {
    title: string;
    period: string;
    description: string;
    image: string;
}

const EMPTY_CHAPTER: ChapterForm = {
    title: "",
    period: "",
    description: "",
    image: "",
};

export function LifeChapters() {
    const [chapters, setChapters] = useState<LifeChapter[]>(lifeChapters);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<ChapterForm>({ ...EMPTY_CHAPTER });
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    // Load from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setChapters(JSON.parse(saved));
        } catch { /* ignore */ }
    }, []);

    const persist = (updated: LifeChapter[]) => {
        setChapters(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleAdd = () => {
        if (!form.title.trim() || !form.period.trim()) return;
        const newChapter: LifeChapter = {
            id: `chapter-${Date.now()}`,
            title: form.title.trim(),
            period: form.period.trim(),
            description: form.description.trim(),
            ...(form.image.trim() ? { image: form.image.trim() } : {}),
        };
        persist([...chapters, newChapter]);
        setForm({ ...EMPTY_CHAPTER });
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirmDeleteId === id) {
            persist(chapters.filter(c => c.id !== id));
            setConfirmDeleteId(null);
        } else {
            setConfirmDeleteId(id);
            setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
        }
    };

    return (
        <section className="py-20">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-light tracking-wide mb-2">The Saga</h2>
                <div className="w-24 h-0.5 bg-accent-primary mx-auto opacity-50"></div>
                <p className="text-gray-400 mt-4">Your life, divided into epochs.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
                <AnimatePresence>
                    {chapters.map((chapter, i) => (
                        <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group"
                        >
                            <GlassCard className="h-full overflow-hidden p-0 relative hover:border-accent-primary/50 transition-colors">
                                <div className="h-48 relative overflow-hidden">
                                    {chapter.image && (
                                        <Image
                                            src={chapter.image}
                                            alt={chapter.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute bottom-4 left-6">
                                        <span className="text-xs font-mono text-accent-primary uppercase tracking-wider">{chapter.period}</span>
                                        <h3 className="text-2xl font-bold text-white mt-1">{chapter.title}</h3>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(chapter.id)}
                                        title={confirmDeleteId === chapter.id ? "Confirm delete?" : "Delete chapter"}
                                        className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 z-10 ${confirmDeleteId === chapter.id
                                            ? "bg-red-500/80 border border-red-400 text-white animate-pulse"
                                            : "bg-black/40 border border-white/10 text-gray-300 hover:bg-red-500/60 hover:border-red-400 hover:text-white"
                                            }`}
                                    >
                                        <Trash2 size={11} />
                                        {confirmDeleteId === chapter.id ? "Confirm?" : "Delete"}
                                    </button>
                                </div>

                                <div className="p-6">
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {chapter.description}
                                    </p>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add New Chapter Card */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: chapters.length * 0.1 }}
                >
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full h-full min-h-[280px] rounded-2xl border-2 border-dashed border-accent-primary/30 hover:border-accent-primary/70 bg-accent-primary/5 hover:bg-accent-primary/10 text-accent-primary/60 hover:text-accent-primary flex flex-col items-center justify-center gap-3 transition-all duration-300 group"
                    >
                        <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus size={24} />
                        </div>
                        <span className="text-sm font-semibold uppercase tracking-widest">Add Chapter</span>
                    </button>
                </motion.div>
            </div>

            {/* Add Chapter Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="w-full max-w-md"
                        >
                            <GlassCard className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Add Life Chapter</h2>
                                    <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Chapter Title *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., College Days"
                                            value={form.title}
                                            onChange={e => setForm({ ...form, title: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Period / Year Range *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 2018 - 2022"
                                            value={form.period}
                                            onChange={e => setForm({ ...form, period: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Brief description of this chapter..."
                                            value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all resize-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Image URL (Optional)</label>
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            value={form.image}
                                            onChange={e => setForm({ ...form, image: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAdd}
                                            disabled={!form.title.trim() || !form.period.trim()}
                                            className="flex-1 py-2.5 rounded-xl bg-accent-primary text-white text-sm font-semibold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Save Chapter ✦
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
