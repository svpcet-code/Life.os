"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Users, Heart, Plus, X, Trash2, Loader2,
    Phone, Mail, MapPin, User
} from "lucide-react";

type GroupType = "Family" | "Friends";

interface Person {
    id: string;
    name: string;
    relation: string;    // e.g. "Brother", "Best Friend"
    emoji: string;       // quick avatar emoji
    note: string;        // short note / tagline
    phone?: string;
    group: GroupType;
    addedAt: string;
}

const STORAGE_KEY = "life-os-inner-circle";

const FAMILY_RELATIONS = ["Father", "Mother", "Brother", "Sister", "Grandfather", "Grandmother", "Uncle", "Aunt", "Cousin", "Other"];
const FRIEND_RELATIONS = ["Best Friend", "School Friend", "College Friend", "Work Friend", "Childhood Friend", "Online Friend", "Other"];

const EMOJIS = ["😊", "🥰", "✨", "🌟", "💫", "🎯", "🔥", "💪", "🌺", "🎉", "🦋", "🌙"];

const EMPTY_FORM = {
    name: "", relation: "", emoji: "😊", note: "", phone: "",
};

export default function PeoplePage() {
    const [viewMode, setViewMode] = useState<"selection" | GroupType>("selection");
    const [people, setPeople] = useState<Person[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    // Load from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setPeople(JSON.parse(saved));
        } catch { /* ignore */ }
    }, []);

    const persist = (updated: Person[]) => {
        setPeople(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const groupPeople = people.filter(p => p.group === viewMode);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.relation.trim()) return;
        setSaving(true);
        const newPerson: Person = {
            id: `person-${Date.now()}`,
            name: form.name.trim(),
            relation: form.relation.trim(),
            emoji: form.emoji,
            note: form.note.trim(),
            phone: form.phone.trim(),
            group: viewMode as GroupType,
            addedAt: new Date().toISOString(),
        };
        persist([...people, newPerson]);
        setForm({ ...EMPTY_FORM });
        setShowModal(false);
        setSaving(false);
    };

    const handleDelete = (id: string) => {
        if (confirmDeleteId === id) {
            persist(people.filter(p => p.id !== id));
            setConfirmDeleteId(null);
        } else {
            setConfirmDeleteId(id);
            setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
        }
    };

    const isFamily = viewMode === "Family";
    const accentColor = isFamily ? "purple" : "pink";
    const accent = isFamily ? "#a855f7" : "#ec4899";
    const relations = isFamily ? FAMILY_RELATIONS : FRIEND_RELATIONS;

    return (
        <main className="min-h-screen relative bg-background text-foreground flex flex-col">
            <ParticleBackground />
            <Navbar />

            <section className="flex-1 pt-32 pb-20 px-4 max-w-7xl mx-auto w-full">

                {/* ── Hero ─────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
                        <Users size={32} className="text-pink-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400">
                        Inner Circle
                    </h1>
                    <p className="text-gray-400">Moments with the ones who matter most.</p>
                </motion.div>

                {/* ── Selection Screen ─────────────────────────────── */}
                <AnimatePresence mode="wait">
                    {viewMode === "selection" ? (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                        >
                            {/* Family Card */}
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setViewMode("Family")}
                                className="cursor-pointer"
                            >
                                <GlassCard className="h-64 flex flex-col items-center justify-center p-8 hover:bg-white/10 transition-colors border-purple-500/30 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
                                    <Users size={64} className="text-purple-400 mb-6" />
                                    <h2 className="text-3xl font-bold text-white mb-2">Family</h2>
                                    <p className="text-gray-400 text-center text-sm">Roots, heritage, and unconditional love.</p>
                                    <div className="mt-4 text-xs text-purple-400/70 font-bold">
                                        {people.filter(p => p.group === "Family").length} members
                                    </div>
                                </GlassCard>
                            </motion.div>

                            {/* Friends Card */}
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setViewMode("Friends")}
                                className="cursor-pointer"
                            >
                                <GlassCard className="h-64 flex flex-col items-center justify-center p-8 hover:bg-white/10 transition-colors border-pink-500/30 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent pointer-events-none" />
                                    <Heart size={64} className="text-pink-400 mb-6" />
                                    <h2 className="text-3xl font-bold text-white mb-2">Friends</h2>
                                    <p className="text-gray-400 text-center text-sm">Chosen family and shared adventures.</p>
                                    <div className="mt-4 text-xs text-pink-400/70 font-bold">
                                        {people.filter(p => p.group === "Friends").length} people
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={viewMode}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* ── Back + Header ─────────────────── */}
                            <div className="flex items-center justify-between mb-8">
                                <button
                                    onClick={() => setViewMode("selection")}
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                                >
                                    ← Back
                                </button>

                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        {isFamily
                                            ? <><Users size={22} className="text-purple-400" /> Family</>
                                            : <><Heart size={22} className="text-pink-400" /> Friends</>
                                        }
                                    </h2>
                                    <span
                                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: accent + "20", color: accent }}
                                    >
                                        {groupPeople.length}
                                    </span>
                                </div>

                                <button
                                    onClick={() => setShowModal(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105"
                                    style={{
                                        background: `linear-gradient(135deg, ${accent}40, ${accent}20)`,
                                        border: `1px solid ${accent}50`,
                                        boxShadow: `0 0 20px ${accent}30`
                                    }}
                                >
                                    <Plus size={15} />
                                    Add {isFamily ? "Family" : "Friend"}
                                </button>
                            </div>

                            {/* ── People Grid ───────────────────── */}
                            {groupPeople.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-24"
                                >
                                    <div
                                        className="inline-flex items-center justify-center w-24 h-24 rounded-full text-5xl mb-6"
                                        style={{ backgroundColor: accent + "15", border: `2px dashed ${accent}40` }}
                                    >
                                        {isFamily ? "👨‍👩‍👧" : "🤝"}
                                    </div>
                                    <p className="text-gray-400 mb-2 text-lg">No {viewMode.toLowerCase()} added yet.</p>
                                    <p className="text-gray-600 text-sm mb-6">
                                        Add the people who matter most to you.
                                    </p>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:scale-105"
                                        style={{ background: `linear-gradient(135deg, ${accent}60, ${accent}30)`, border: `1px solid ${accent}50` }}
                                    >
                                        + Add First {isFamily ? "Family Member" : "Friend"}
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                    <AnimatePresence>
                                        {groupPeople.map((person, idx) => {
                                            const isConfirming = confirmDeleteId === person.id;
                                            return (
                                                <motion.div
                                                    key={person.id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.85, y: -10 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    layout
                                                >
                                                    <div style={{ borderRadius: "1rem", border: `1px solid ${accent}30` }}>
                                                        <GlassCard
                                                            className="p-5 flex flex-col items-center text-center relative group transition-all hover:scale-[1.02] border-0"
                                                        >
                                                            {/* Glow on hover */}
                                                            <div
                                                                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                                                style={{ boxShadow: `inset 0 0 40px ${accent}10` }}
                                                            />

                                                            {/* Delete button */}
                                                            <button
                                                                onClick={() => handleDelete(person.id)}
                                                                className={`absolute top-3 right-3 p-1.5 rounded-lg text-xs font-semibold transition-all z-10 ${isConfirming
                                                                    ? "bg-red-500/30 border border-red-400/50 text-red-300 animate-pulse"
                                                                    : "opacity-0 group-hover:opacity-100 bg-white/5 border border-white/10 text-gray-500 hover:bg-red-500/20 hover:text-red-400"
                                                                    }`}
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>

                                                            {/* Avatar emoji */}
                                                            <div
                                                                className="w-16 h-16 rounded-full flex items-center justify-center text-4xl mb-3 mt-1"
                                                                style={{ backgroundColor: accent + "20", border: `2px solid ${accent}40` }}
                                                            >
                                                                {person.emoji}
                                                            </div>

                                                            {/* Name */}
                                                            <h3 className="text-lg font-bold text-white mb-1">{person.name}</h3>

                                                            {/* Relation badge */}
                                                            <span
                                                                className="text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
                                                                style={{ backgroundColor: accent + "20", color: accent }}
                                                            >
                                                                {person.relation}
                                                            </span>

                                                            {/* Note */}
                                                            {person.note && (
                                                                <p className="text-xs text-gray-500 leading-relaxed">{person.note}</p>
                                                            )}

                                                            {/* Phone */}
                                                            {person.phone && (
                                                                <a
                                                                    href={`tel:${person.phone}`}
                                                                    className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
                                                                >
                                                                    <Phone size={11} />
                                                                    {person.phone}
                                                                </a>
                                                            )}
                                                        </GlassCard>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>

                                    {/* Add more card */}
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onClick={() => setShowModal(true)}
                                        className="rounded-xl flex flex-col items-center justify-center gap-3 p-5 min-h-[180px] transition-all hover:scale-[1.02] text-gray-600 hover:text-gray-300"
                                        style={{ border: `2px dashed ${accent}30`, backgroundColor: accent + "05" }}
                                    >
                                        <Plus size={28} />
                                        <span className="text-sm font-semibold">Add {isFamily ? "Family Member" : "Friend"}</span>
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* ── Add Person Modal ─────────────────────────────── */}
            <AnimatePresence>
                {showModal && viewMode !== "selection" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="w-full max-w-md rounded-2xl overflow-hidden"
                            style={{
                                background: "rgba(8,8,16,0.97)",
                                border: `1px solid ${accent}30`,
                                boxShadow: `0 0 60px ${accent}20`
                            }}
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        {isFamily ? <Users size={18} style={{ color: accent }} /> : <Heart size={18} style={{ color: accent }} />}
                                        Add {isFamily ? "Family Member" : "Friend"}
                                    </h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form onSubmit={handleAdd} className="space-y-4">
                                    {/* Name */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Name *</label>
                                        <input
                                            required type="text" placeholder="Full name…"
                                            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-opacity-100 transition-all"
                                            style={{ ["--tw-ring-color" as string]: accent }}
                                            onFocus={e => (e.target.style.borderColor = accent + "80")}
                                            onBlur={e => (e.target.style.borderColor = "")}
                                        />
                                    </div>

                                    {/* Relation */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Relation *</label>
                                        <select
                                            required value={form.relation}
                                            onChange={e => setForm({ ...form, relation: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                                        >
                                            <option value="" className="bg-gray-900">Select relation…</option>
                                            {relations.map(r => (
                                                <option key={r} value={r} className="bg-gray-900">{r}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Emoji picker */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pick Avatar</label>
                                        <div className="flex flex-wrap gap-2">
                                            {EMOJIS.map(em => (
                                                <button
                                                    key={em} type="button"
                                                    onClick={() => setForm({ ...form, emoji: em })}
                                                    className={`w-10 h-10 rounded-xl text-xl transition-all hover:scale-110 ${form.emoji === em ? "scale-110" : "bg-white/5 hover:bg-white/10"
                                                        }`}
                                                    style={form.emoji === em ? { backgroundColor: accent + "30", border: `2px solid ${accent}60` } : {}}
                                                >
                                                    {em}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Note */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Short Note</label>
                                        <input
                                            type="text" placeholder="A tagline or memory…"
                                            value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none transition-all"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                            <Phone size={11} /> Phone (optional)
                                        </label>
                                        <input
                                            type="tel" placeholder="+91 9999999999"
                                            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none transition-all"
                                        />
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button" onClick={() => setShowModal(false)}
                                            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit" disabled={saving}
                                            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
                                            style={{ background: `linear-gradient(135deg, ${accent}50, ${accent}25)`, border: `1px solid ${accent}50` }}
                                        >
                                            {saving
                                                ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                                                : `Add to ${viewMode} ✦`
                                            }
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
