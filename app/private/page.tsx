"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { memories as staticMemories, moods, Memory, MoodType } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lock, Shield, EyeOff, Plus, X, Trash2, Loader2 } from "lucide-react";
import { LockScreen } from "@/components/features/LockScreen";

const EMPTY_FORM = {
    title: "",
    date: new Date().toISOString().split("T")[0],
    mood: "Intense" as MoodType,
    description: "",
    fullStory: "",
};

export default function PrivatePage() {
    const [isUnlocked, setIsUnlocked] = useState(false);

    // Private memories: start from static, merge DB on load
    const [privateList, setPrivateList] = useState<Memory[]>(
        staticMemories.filter((m) => m.isPrivate)
    );
    const [dbLoaded, setDbLoaded] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    // Load persisted private memories from DB
    useEffect(() => {
        fetch("/api/memories")
            .then((res) => {
                if (!res.ok) throw new Error("Not authenticated");
                return res.json();
            })
            .then((dbMemories: Memory[]) => {
                const dbPrivate = dbMemories.filter((m) => m.isPrivate);
                if (dbPrivate.length > 0) {
                    setPrivateList((prev) => {
                        const existingIds = new Set(prev.map((m) => m.id));
                        const newOnes = dbPrivate.filter((m) => !existingIds.has(m.id));
                        return [...newOnes, ...prev];
                    });
                }
                setDbLoaded(true);
            })
            .catch(() => setDbLoaded(true));
    }, []);

    // ── Add ──────────────────────────────────────────────────────────────────
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            title: form.title,
            date: form.date,
            mood: form.mood,
            description: form.description,
            fullStory: form.fullStory,
            isPrivate: true,
        };

        try {
            const res = await fetch("/api/memories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const saved: Memory = await res.json();
                setPrivateList((prev) => [saved, ...prev]);
            } else {
                const temp: Memory = { id: `local-${Date.now()}`, ...payload };
                setPrivateList((prev) => [temp, ...prev]);
            }
        } catch {
            const temp: Memory = { id: `local-${Date.now()}`, ...payload };
            setPrivateList((prev) => [temp, ...prev]);
        }

        setForm({ ...EMPTY_FORM });
        setShowModal(false);
        setSaving(false);
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async (id: string) => {
        if (confirmDeleteId === id) {
            setPrivateList((prev) => prev.filter((m) => m.id !== id));
            setConfirmDeleteId(null);
            try {
                await fetch(`/api/memories?id=${encodeURIComponent(id)}`, { method: "DELETE" });
            } catch { /* ignore */ }
        } else {
            setConfirmDeleteId(id);
            setTimeout(() => setConfirmDeleteId((prev) => (prev === id ? null : prev)), 3000);
        }
    };

    return (
        <main className="min-h-screen relative bg-background text-foreground flex flex-col">
            <ParticleBackground />
            <Navbar />

            <AnimatePresence>
                {!isUnlocked && (
                    <LockScreen onUnlock={() => setIsUnlocked(true)} />
                )}
            </AnimatePresence>

            <section className="flex-1 pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">
                {isUnlocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Header */}
                        <div className="text-center mb-16">
                            <div className="inline-block p-4 rounded-full bg-red-500/10 mb-4 border border-red-500/20">
                                <Shield size={32} className="text-red-400" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-red-100">
                                Restricted Archives
                            </h1>
                            <p className="text-red-300/60">Eyes only. These memories are encrypted.</p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between mb-8">
                            {!dbLoaded && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Loader2 size={13} className="animate-spin" />
                                    Loading…
                                </div>
                            )}
                            <div className="ml-auto">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 hover:border-red-400/60 font-semibold text-sm shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.35)] transition-all duration-200"
                                >
                                    <Plus size={16} />
                                    Add Secret
                                </button>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <AnimatePresence>
                                {privateList.length > 0 ? (
                                    privateList.map((memory, idx) => (
                                        <motion.div
                                            key={memory.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: idx * 0.07 }}
                                            layout
                                        >
                                            <GlassCard className="h-full border-red-500/20 bg-red-950/10 hover:bg-red-900/20 transition-colors">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-xs font-mono text-red-400 border border-red-500/30 px-2 py-1 rounded">
                                                        CONFIDENTIAL
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <EyeOff size={16} className="text-red-400/50" />
                                                        {/* Delete button */}
                                                        <button
                                                            onClick={() => handleDelete(memory.id)}
                                                            title={confirmDeleteId === memory.id ? "Confirm delete?" : "Delete"}
                                                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${confirmDeleteId === memory.id
                                                                    ? "bg-red-500/50 border border-red-400 text-white animate-pulse"
                                                                    : "bg-white/5 border border-white/10 text-gray-500 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400"
                                                                }`}
                                                        >
                                                            <Trash2 size={11} />
                                                            {confirmDeleteId === memory.id ? "Confirm?" : "Delete"}
                                                        </button>
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold mb-2 text-red-100">{memory.title}</h3>
                                                <p className="text-red-200/60 mb-4">{memory.description}</p>
                                                <div className="text-xs text-red-400/40 text-right">{memory.date}</div>
                                            </GlassCard>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full text-center py-20 text-gray-500"
                                    >
                                        No private memories found.
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </section>

            {/* ── Add Secret Modal ───────────────────────────────────────────────── */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="w-full max-w-xl max-h-[90vh] overflow-y-auto"
                        >
                            <GlassCard className="p-6 md:p-8 border-red-500/30 bg-red-950/20">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <Lock size={18} className="text-red-400" />
                                        <h2 className="text-xl font-bold text-red-100">Add Secret Memory</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form onSubmit={handleAdd} className="space-y-4">
                                    {/* Title + Date */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-red-400/70 uppercase tracking-wider">Title *</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g., My Secret"
                                                value={form.title}
                                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                                className="w-full bg-red-950/30 border border-red-500/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-red-400/70 uppercase tracking-wider">Date *</label>
                                            <input
                                                required
                                                type="date"
                                                value={form.date}
                                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                                className="w-full bg-red-950/30 border border-red-500/20 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Mood */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-red-400/70 uppercase tracking-wider">Mood</label>
                                        <div className="flex flex-wrap gap-2">
                                            {moods.map((mood) => (
                                                <button
                                                    key={mood}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, mood })}
                                                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${form.mood === mood
                                                            ? "bg-red-500/40 border-red-400/60 text-red-200"
                                                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                                                        }`}
                                                >
                                                    {mood}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-red-400/70 uppercase tracking-wider">Short Description</label>
                                        <input
                                            type="text"
                                            placeholder="One-line summary..."
                                            value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            className="w-full bg-red-950/30 border border-red-500/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                                        />
                                    </div>

                                    {/* Full Story */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-red-400/70 uppercase tracking-wider">Full Story</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Write what only you know..."
                                            value={form.fullStory}
                                            onChange={(e) => setForm({ ...form, fullStory: e.target.value })}
                                            className="w-full bg-red-950/30 border border-red-500/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none"
                                        />
                                    </div>

                                    {/* Submit */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex-1 py-2.5 rounded-xl bg-red-500/30 border border-red-500/50 text-red-100 text-sm font-semibold hover:bg-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                        >
                                            {saving ? <><Loader2 size={14} className="animate-spin" /> Sealing…</> : "Seal Memory 🔒"}
                                        </button>
                                    </div>
                                </form>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
