"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Memory, moods, MoodType } from "@/lib/data";
import {
    X, ChevronLeft, ChevronRight, Play, Pause,
    Plus, Trash2, Loader2, BookOpen, Calendar
} from "lucide-react";

interface MemoryReelProps {
    memories: Memory[];
    onClose: () => void;
    onAdd: (memory: Memory) => void;
    onDelete: (id: string) => void;
}

const REEL_DURATION = 5000; // ms per slide

const moodGradients: Record<string, string> = {
    Happy: "from-yellow-900/80 via-orange-900/60 to-black",
    Sad: "from-blue-950/90 via-slate-900/70 to-black",
    Achievement: "from-purple-950/80 via-fuchsia-900/60 to-black",
    Lesson: "from-emerald-950/80 via-teal-900/60 to-black",
    Love: "from-rose-950/80 via-pink-900/60 to-black",
    Growth: "from-indigo-950/80 via-violet-900/60 to-black",
    Calm: "from-cyan-950/80 via-sky-900/60 to-black",
    Intense: "from-red-950/80 via-orange-900/60 to-black",
    Family: "from-amber-950/80 via-yellow-900/60 to-black",
    Friends: "from-sky-950/80 via-blue-900/60 to-black",
};

const moodAccent: Record<string, string> = {
    Happy: "#facc15", Sad: "#60a5fa", Achievement: "#c084fc",
    Lesson: "#34d399", Love: "#fb7185", Growth: "#818cf8",
    Calm: "#22d3ee", Intense: "#f87171", Family: "#fbbf24", Friends: "#38bdf8",
};

const EMPTY_FORM = {
    title: "", date: new Date().toISOString().split("T")[0],
    mood: "Happy" as MoodType, description: "", fullStory: "",
};

// Page-flip variants
const pageVariants = {
    enterRight: { rotateY: 90, opacity: 0, transformOrigin: "left center" },
    center: { rotateY: 0, opacity: 1, transformOrigin: "left center" },
    exitLeft: { rotateY: -90, opacity: 0, transformOrigin: "left center" },
    enterLeft: { rotateY: -90, opacity: 0, transformOrigin: "right center" },
    exitRight: { rotateY: 90, opacity: 0, transformOrigin: "right center" },
};

export function MemoryReel({ memories, onClose, onAdd, onDelete }: MemoryReelProps) {
    const [current, setCurrent] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressRef = useRef<NodeJS.Timeout | null>(null);

    const total = memories.length;

    const goNext = useCallback(() => {
        if (total === 0) return;
        setDirection(1);
        setCurrent((c) => (c + 1) % total);
        setProgress(0);
    }, [total]);

    const goPrev = useCallback(() => {
        if (total === 0) return;
        setDirection(-1);
        setCurrent((c) => (c - 1 + total) % total);
        setProgress(0);
    }, [total]);

    // Auto-play ticker
    useEffect(() => {
        if (!playing || total === 0) return;
        const step = 100 / (REEL_DURATION / 50);
        progressRef.current = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) { goNext(); return 0; }
                return p + step;
            });
        }, 50);
        return () => { if (progressRef.current) clearInterval(progressRef.current); };
    }, [playing, current, goNext, total]);

    // Keyboard navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [goNext, goPrev, onClose]);

    const handleDelete = (id: string) => {
        if (confirmDeleteId === id) {
            onDelete(id);
            setConfirmDeleteId(null);
            if (current >= total - 1) setCurrent(Math.max(0, total - 2));
        } else {
            setConfirmDeleteId(id);
            setTimeout(() => setConfirmDeleteId((p) => (p === id ? null : p)), 3000);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const payload = { ...form, isPrivate: false };
        try {
            const res = await fetch("/api/memories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const saved: Memory = res.ok ? await res.json() : { id: `local-${Date.now()}`, ...payload };
            onAdd(saved);
        } catch {
            onAdd({ id: `local-${Date.now()}`, ...payload });
        }
        setForm({ ...EMPTY_FORM });
        setShowAddModal(false);
        setSaving(false);
    };

    const memory = memories[current];
    const accent = memory ? (moodAccent[memory.mood] ?? "#8b5cf6") : "#8b5cf6";
    const gradient = memory ? (moodGradients[memory.mood] ?? "from-gray-900 via-gray-800 to-black") : "from-gray-900 via-gray-800 to-black";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-black"
            style={{ perspective: "1200px" }}
        >
            {/* ── Top Story Progress Bars ───────────────────────────────── */}
            <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3 pb-0">
                {memories.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); setProgress(0); }}
                        className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden"
                    >
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: accent }}
                            animate={{
                                width: i < current ? "100%" : i === current ? `${progress}%` : "0%",
                            }}
                            transition={{ duration: 0, ease: "linear" }}
                        />
                    </button>
                ))}
            </div>

            {/* ── Top Bar (Controls) ─────────────────────────────────────── */}
            <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-between px-4 pt-2">
                <div className="flex items-center gap-2">
                    <BookOpen size={16} style={{ color: accent }} />
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
                        Memory Reel
                    </span>
                    <span className="text-xs text-white/40 ml-1">
                        {current + 1} / {total}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {/* Play/Pause */}
                    <button
                        onClick={() => setPlaying((p) => !p)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
                    >
                        {playing ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    {/* Add */}
                    <button
                        onClick={() => { setPlaying(false); setShowAddModal(true); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
                        style={{ borderColor: accent + "60", color: accent, background: accent + "15" }}
                    >
                        <Plus size={12} /> Add
                    </button>
                    {/* Close */}
                    <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all">
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* ── Page Background Gradient ───────────────────────────────── */}
            <AnimatePresence>
                <motion.div
                    key={`bg-${current}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`absolute inset-0 bg-gradient-to-b ${gradient}`}
                />
            </AnimatePresence>

            {/* Cinematic grain overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                }}
            />

            {/* ── Main Page Flip Card ────────────────────────────────────── */}
            {total > 0 ? (
                <div className="flex-1 flex items-center justify-center px-4 py-24" style={{ perspective: "1200px" }}>
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={current}
                            custom={direction}
                            variants={{
                                initial: (d: number) => ({
                                    rotateY: d > 0 ? 85 : -85,
                                    opacity: 0,
                                    scale: 0.92,
                                    transformOrigin: d > 0 ? "left center" : "right center",
                                }),
                                animate: {
                                    rotateY: 0,
                                    opacity: 1,
                                    scale: 1,
                                    transformOrigin: "center center",
                                },
                                exit: (d: number) => ({
                                    rotateY: d > 0 ? -85 : 85,
                                    opacity: 0,
                                    scale: 0.92,
                                    transformOrigin: d > 0 ? "right center" : "left center",
                                }),
                            }}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                            className="w-full max-w-2xl"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            {/* Book page shadow */}
                            <div
                                className="absolute inset-0 rounded-2xl pointer-events-none"
                                style={{
                                    boxShadow: `0 0 80px ${accent}30, 0 30px 60px rgba(0,0,0,0.7), inset 0 0 0 1px ${accent}20`,
                                    borderRadius: "16px",
                                }}
                            />

                            {/* Card Content */}
                            <div
                                className="relative rounded-2xl overflow-hidden"
                                style={{
                                    background: `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)`,
                                    border: `1px solid ${accent}25`,
                                    backdropFilter: "blur(20px)",
                                }}
                            >
                                {/* Top spine line (book effect) */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                                    style={{ background: `linear-gradient(to bottom, ${accent}80, ${accent}20)` }}
                                />

                                <div className="pl-6 pr-6 pt-8 pb-8">
                                    {/* Mood + Date row */}
                                    <div className="flex items-center justify-between mb-6">
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full"
                                            style={{
                                                color: accent,
                                                backgroundColor: accent + "20",
                                                border: `1px solid ${accent}40`,
                                            }}
                                        >
                                            {memory.mood}
                                        </motion.span>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 text-xs text-white/40">
                                                <Calendar size={11} />
                                                {memory.date}
                                            </div>
                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDelete(memory.id)}
                                                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${confirmDeleteId === memory.id
                                                        ? "bg-red-500/30 border border-red-400/50 text-red-300 animate-pulse"
                                                        : "bg-white/5 border border-white/10 text-white/30 hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-400"
                                                    }`}
                                            >
                                                <Trash2 size={10} />
                                                {confirmDeleteId === memory.id ? "Sure?" : "Delete"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <motion.h2
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                        className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
                                    >
                                        {memory.title}
                                    </motion.h2>

                                    {/* Divider */}
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.25, duration: 0.4 }}
                                        className="h-px mb-6 origin-left"
                                        style={{ background: `linear-gradient(to right, ${accent}60, transparent)` }}
                                    />

                                    {/* Description */}
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-white/70 text-lg leading-relaxed mb-4"
                                    >
                                        {memory.description}
                                    </motion.p>

                                    {/* Full Story (if exists) */}
                                    {memory.fullStory && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-white/40 text-sm leading-relaxed italic border-l-2 pl-4"
                                            style={{ borderColor: accent + "40" }}
                                        >
                                            {memory.fullStory}
                                        </motion.p>
                                    )}

                                    {/* Page number */}
                                    <div className="flex items-center justify-end mt-8">
                                        <span className="text-xs font-mono" style={{ color: accent + "50" }}>
                                            — {current + 1} —
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-white/30 gap-4">
                    <BookOpen size={48} />
                    <p className="text-lg">No memories yet. Add your first one!</p>
                </div>
            )}

            {/* ── Side Navigation Arrows ─────────────────────────────────── */}
            <button
                onClick={goPrev}
                disabled={total === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white disabled:opacity-20 transition-all hover:scale-110"
            >
                <ChevronLeft size={22} />
            </button>
            <button
                onClick={goNext}
                disabled={total === 0}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white disabled:opacity-20 transition-all hover:scale-110"
            >
                <ChevronRight size={22} />
            </button>

            {/* ── Click zones for nav ─────────────────────────────────────── */}
            <div className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer" onClick={goPrev} />
            <div className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer" onClick={goNext} />
            <div
                className="absolute inset-y-0 left-1/3 right-1/3 z-10 cursor-pointer"
                onClick={() => setPlaying((p) => !p)}
            />

            {/* ── Add Memory Modal ────────────────────────────────────────── */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl"
                            style={{
                                background: "rgba(10,10,20,0.95)",
                                border: `1px solid ${accent}30`,
                                boxShadow: `0 0 60px ${accent}20`,
                            }}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={16} style={{ color: accent }} />
                                        <h2 className="text-xl font-bold text-white">Add to Reel</h2>
                                    </div>
                                    <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>

                                <form onSubmit={handleAdd} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title *</label>
                                            <input required type="text" placeholder="Memory title…"
                                                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all"
                                                style={{ ["--tw-ring-color" as string]: accent + "60" }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date *</label>
                                            <input required type="date" value={form.date}
                                                onChange={e => setForm({ ...form, date: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mood</label>
                                        <div className="flex flex-wrap gap-2">
                                            {moods.map(mood => (
                                                <button key={mood} type="button"
                                                    onClick={() => setForm({ ...form, mood })}
                                                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${form.mood === mood
                                                            ? "text-white"
                                                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                                        }`}
                                                    style={form.mood === mood ? { backgroundColor: moodAccent[mood] + "30", borderColor: moodAccent[mood] + "60", color: moodAccent[mood] } : {}}
                                                >
                                                    {mood}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Short Description</label>
                                        <input type="text" placeholder="One-line summary…"
                                            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Story</label>
                                        <textarea rows={3} placeholder="What happened…"
                                            value={form.fullStory} onChange={e => setForm({ ...form, fullStory: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setShowAddModal(false)}
                                            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={saving}
                                            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                            style={{ background: accent + "30", border: `1px solid ${accent}50` }}
                                        >
                                            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : "Add to Reel ✦"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
