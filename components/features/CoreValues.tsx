"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { coreValues, Value } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";

const STORAGE_KEY = "lifeos_corevalues";

const COLOR_OPTIONS = [
    { label: "Blue", value: "bg-blue-500" },
    { label: "Green", value: "bg-green-500" },
    { label: "Purple", value: "bg-purple-500" },
    { label: "Red", value: "bg-red-500" },
    { label: "Amber", value: "bg-amber-500" },
    { label: "Pink", value: "bg-pink-500" },
    { label: "Cyan", value: "bg-cyan-500" },
    { label: "Indigo", value: "bg-indigo-500" },
];

export function CoreValues() {
    const [values, setValues] = useState<Value[]>(coreValues);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ label: "", description: "", color: "bg-blue-500" });
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    // Load from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setValues(JSON.parse(saved));
        } catch { /* ignore */ }
    }, []);

    const persist = (updated: Value[]) => {
        setValues(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleAdd = () => {
        if (!form.label.trim()) return;
        const newValue: Value = {
            id: `value-${Date.now()}`,
            label: form.label.trim(),
            description: form.description.trim() || "A core value that guides me.",
            color: form.color,
        };
        persist([...values, newValue]);
        setForm({ label: "", description: "", color: "bg-blue-500" });
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirmDeleteId === id) {
            persist(values.filter(v => v.id !== id));
            setConfirmDeleteId(null);
        } else {
            setConfirmDeleteId(id);
            setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
        }
    };

    return (
        <section className="py-8">
            <div className="flex items-center justify-between mb-6 px-1">
                <h3 className="text-xl font-bold text-white">Core Identity Pillars</h3>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-primary/20 border border-accent-primary/30 text-accent-primary hover:bg-accent-primary/30 hover:border-accent-primary/60 text-xs font-semibold uppercase tracking-wider transition-all duration-200"
                >
                    <Plus size={13} />
                    Add Value
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <AnimatePresence>
                    {values.map((value, i) => (
                        <motion.div
                            key={value.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="relative group"
                        >
                            <GlassCard className="p-6 h-full flex flex-col items-center text-center hover:bg-white/10 transition-colors cursor-default">
                                <div className={`w-3 h-3 rounded-full ${value.color} mb-4 shadow-[0_0_10px_currentColor] group-hover:scale-125 transition-transform`} />
                                <h4 className="text-lg font-bold text-white mb-2">{value.label}</h4>
                                <p className="text-xs text-gray-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {value.description}
                                </p>
                            </GlassCard>

                            {/* Delete button appears on hover */}
                            <button
                                onClick={() => handleDelete(value.id)}
                                title={confirmDeleteId === value.id ? "Click again to confirm" : "Delete"}
                                className={`absolute top-2 right-2 p-1 rounded-lg text-xs transition-all duration-200 ${confirmDeleteId === value.id
                                        ? "bg-red-500/80 text-white animate-pulse"
                                        : "opacity-0 group-hover:opacity-100 bg-black/40 text-gray-400 hover:bg-red-500/60 hover:text-white"
                                    }`}
                            >
                                {confirmDeleteId === value.id
                                    ? <span className="text-[10px] font-bold px-1">Sure?</span>
                                    : <Trash2 size={11} />
                                }
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Value Modal */}
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
                            className="w-full max-w-sm"
                        >
                            <GlassCard className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Add Core Value</h2>
                                    <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Value Name *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Integrity"
                                            value={form.label}
                                            onChange={e => setForm({ ...form, label: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
                                        <input
                                            type="text"
                                            placeholder="What this value means to you..."
                                            value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Color</label>
                                        <div className="flex flex-wrap gap-2">
                                            {COLOR_OPTIONS.map(c => (
                                                <button
                                                    key={c.value}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, color: c.value })}
                                                    className={`w-7 h-7 rounded-full ${c.value} transition-all ${form.color === c.value ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110" : "opacity-60 hover:opacity-100"}`}
                                                    title={c.label}
                                                />
                                            ))}
                                        </div>
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
                                            disabled={!form.label.trim()}
                                            className="flex-1 py-2.5 rounded-xl bg-accent-primary text-white text-sm font-semibold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Add Value ✦
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
