"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { memories as staticMemories, moods, Memory, MoodType } from "@/lib/data";
import { TimelineItem } from "@/components/features/TimelineItem";
import { MoodFilter } from "@/components/features/MoodFilter";
import { useState, useEffect } from "react";
import { Plus, X, Loader2, BookOpen } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MemoryReel } from "@/components/features/MemoryReel";

const EMPTY_FORM = {
    title: "",
    date: new Date().toISOString().split("T")[0],
    mood: "Happy" as MoodType,
    description: "",
    fullStory: "",
    image: "",
    isPrivate: false,
};

export default function TimelinePage() {
    const [currentMood, setCurrentMood] = useState("All");

    // Start with static memories; merge in DB memories on load
    const [memoryList, setMemoryList] = useState<Memory[]>(staticMemories);
    const [dbLoaded, setDbLoaded] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [showReel, setShowReel] = useState(false);

    // ── Load persisted memories from DB on mount ────────────────────────────
    useEffect(() => {
        fetch("/api/memories")
            .then(res => {
                if (!res.ok) throw new Error("Not authenticated or fetch failed");
                return res.json();
            })
            .then((dbMemories: Memory[]) => {
                if (Array.isArray(dbMemories) && dbMemories.length > 0) {
                    // Merge DB memories at the top; avoid duplicates by id
                    setMemoryList(prev => {
                        const existingIds = new Set(prev.map(m => m.id));
                        const newOnes = dbMemories.filter(m => !existingIds.has(m.id));
                        return [...newOnes, ...prev];
                    });
                }
                setDbLoaded(true);
            })
            .catch(() => {
                // Not logged in or DB unavailable — static memories still show
                setDbLoaded(true);
            });
    }, []);

    const filteredMemories = currentMood === "All"
        ? memoryList
        : memoryList.filter(m => m.mood === currentMood);

    const sortedMemories = [...filteredMemories].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // ── Add ────────────────────────────────────────────────────────────────
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaveError("");

        const payload = {
            title: formData.title,
            date: formData.date,
            mood: formData.mood,
            description: formData.description,
            fullStory: formData.fullStory,
            image: formData.image || undefined,
            isPrivate: formData.isPrivate,
        };

        try {
            const res = await fetch("/api/memories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                // Saved to DB — use the returned object (has server-generated id)
                const saved: Memory = await res.json();
                setMemoryList(prev => [saved, ...prev]);
            } else {
                // Not authenticated — save client-side only
                const tempMemory: Memory = {
                    id: `local-${Date.now()}`,
                    ...payload,
                    image: formData.image || undefined,
                };
                setMemoryList(prev => [tempMemory, ...prev]);
            }
        } catch {
            // Offline / error — still add locally so user doesn't lose work
            const tempMemory: Memory = {
                id: `local-${Date.now()}`,
                ...payload,
                image: formData.image || undefined,
            };
            setMemoryList(prev => [tempMemory, ...prev]);
        }

        setFormData({ ...EMPTY_FORM });
        setShowModal(false);
        setSaving(false);
    };

    // ── Delete ─────────────────────────────────────────────────────────────
    const handleDelete = async (id: string) => {
        // Optimistic: remove from UI immediately
        setMemoryList(prev => prev.filter(m => m.id !== id));

        // Fire-and-forget: try to delete from DB
        try {
            await fetch(`/api/memories?id=${encodeURIComponent(id)}`, {
                method: "DELETE",
            });
        } catch {
            // Silently ignore if not authenticated or offline
        }
    };

    return (
        <main className="min-h-screen relative bg-background text-foreground flex flex-col">
            <ParticleBackground />
            <Navbar />

            <section className="pt-32 pb-20 px-4 max-w-5xl mx-auto w-full flex-1">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent-tertiary via-accent-primary to-accent-secondary">
                        Memory Timeline
                    </h1>
                    <p className="text-gray-400">Tracing the coordinates of your life.</p>
                </motion.div>

                {/* Controls Row */}
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                    <MoodFilter currentMood={currentMood} onMoodChange={setCurrentMood} moods={moods} />
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowReel(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 font-semibold text-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] hover:scale-105 transition-all duration-200 whitespace-nowrap"
                        >
                            <BookOpen size={15} />
                            Memory Reel
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary text-white font-semibold text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-105 transition-all duration-200 whitespace-nowrap"
                        >
                            <Plus size={16} />
                            Add Memory
                        </button>
                    </div>
                </div>

                {/* DB loading indicator */}
                {!dbLoaded && (
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-6">
                        <Loader2 size={13} className="animate-spin" />
                        Loading saved memories…
                    </div>
                )}

                {/* Timeline */}
                <div className="relative flex flex-col md:items-center">
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-primary/30 to-transparent hidden md:block" />

                    <AnimatePresence>
                        {sortedMemories.length > 0 ? (
                            sortedMemories.map((memory, idx) => (
                                <TimelineItem
                                    key={memory.id}
                                    memory={memory}
                                    idx={idx}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 text-gray-500"
                            >
                                No memories found for this mood.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* ── Add Memory Modal ─────────────────────────────────────────── */}
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
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="w-full max-w-xl max-h-[90vh] overflow-y-auto"
                        >
                            <GlassCard className="p-6 md:p-8">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white">Add Memory</h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {saveError && (
                                    <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">
                                        {saveError}
                                    </p>
                                )}

                                <form onSubmit={handleAdd} className="space-y-4">
                                    {/* Title + Date */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title *</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g., First Solo Trip"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date *</label>
                                            <input
                                                required
                                                type="date"
                                                value={formData.date}
                                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Mood */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mood *</label>
                                        <div className="flex flex-wrap gap-2">
                                            {moods.map(mood => (
                                                <button
                                                    key={mood}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, mood })}
                                                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${formData.mood === mood
                                                        ? "bg-accent-primary border-accent-primary text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]"
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
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Short Description</label>
                                        <input
                                            type="text"
                                            placeholder="One-line summary..."
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                                        />
                                    </div>

                                    {/* Full Story */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Story</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Write the details..."
                                            value={formData.fullStory}
                                            onChange={e => setFormData({ ...formData, fullStory: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all resize-none"
                                        />
                                    </div>

                                    {/* Image URL */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Image URL (Optional)</label>
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                                        />
                                    </div>

                                    {/* Private Toggle */}
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-white">Private Memory</p>
                                            <p className="text-xs text-gray-400">Only visible in the Private Vault</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })}
                                            className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${formData.isPrivate ? "bg-accent-primary" : "bg-white/10"}`}
                                        >
                                            <motion.div
                                                animate={{ x: formData.isPrivate ? 22 : 2 }}
                                                className="w-4 h-4 rounded-full bg-white absolute top-1"
                                            />
                                        </button>
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
                                            className="flex-1 py-2.5 rounded-xl bg-accent-primary text-white text-sm font-semibold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-[1.02] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                        >
                                            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : "Preserve Memory ✦"}
                                        </button>
                                    </div>
                                </form>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Memory Reel Cinematic Mode ─────────────────────────────── */}
            <AnimatePresence>
                {showReel && (
                    <MemoryReel
                        memories={sortedMemories}
                        onClose={() => setShowReel(false)}
                        onAdd={(memory) => setMemoryList(prev => [memory, ...prev])}
                        onDelete={handleDelete}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
