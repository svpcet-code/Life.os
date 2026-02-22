"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Send, Unlock, Trash2, Loader2, Clock } from "lucide-react";

interface VaultMessage {
    id: string;
    content: string;
    unlockAt: string;
    isLocked: boolean;
    createdAt: string;
}

export default function VaultPage() {
    const [content, setContent] = useState("");
    const [unlockDate, setUnlockDate] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [messages, setMessages] = useState<VaultMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    // ── Load messages ─────────────────────────────────────────────────────────
    useEffect(() => {
        fetch("/api/messages")
            .then((r) => {
                if (!r.ok) throw new Error("Not authenticated");
                return r.json();
            })
            .then((data) => setMessages(Array.isArray(data) ? data : []))
            .catch(() => setMessages([]))
            .finally(() => setLoading(false));
    }, []);

    // ── Send Message ──────────────────────────────────────────────────────────
    const handleSend = async () => {
        setError("");

        if (!content.trim()) { setError("Please write a message first."); return; }
        if (!unlockDate) { setError("Please set an unlock date."); return; }

        const unlockAt = new Date(unlockDate);
        if (unlockAt <= new Date()) { setError("Unlock date must be in the future."); return; }

        setSending(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: content.trim(),
                    unlockAt: unlockAt.toISOString(),
                }),
            });

            if (res.ok) {
                const saved: VaultMessage = await res.json();
                setMessages((prev) => [saved, ...prev]);
                setContent("");
                setUnlockDate("");
            } else {
                const data = await res.json();
                setError(data.error ?? "Failed to send. Are you logged in?");
            }
        } catch {
            setError("Network error. Please try again.");
        }
        setSending(false);
    };

    // ── Delete Message ────────────────────────────────────────────────────────
    const handleDelete = async (id: string) => {
        if (confirmDeleteId !== id) {
            setConfirmDeleteId(id);
            setTimeout(() => setConfirmDeleteId((p) => (p === id ? null : p)), 3000);
            return;
        }
        setDeleting(id);
        setConfirmDeleteId(null);
        try {
            await fetch(`/api/messages?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        } catch { /* ignore */ }
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setDeleting(null);
    };

    const isUnlocked = (msg: VaultMessage) =>
        !msg.isLocked || new Date(msg.unlockAt) <= new Date();

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    return (
        <main className="min-h-screen relative bg-background text-foreground flex flex-col">
            <ParticleBackground />
            <Navbar />

            <section className="flex-1 pt-32 pb-20 px-4 max-w-4xl mx-auto w-full text-center">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-16"
                >
                    <div className="inline-block p-6 rounded-full bg-white/5 border border-white/10 mb-6 relative">
                        <div className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-full" />
                        <Lock size={48} className="text-accent-primary relative z-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Message Vault</h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Send encrypted transmissions to your future self.
                        Time-locked until the moment is right.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 text-left">

                    {/* ── Write New Message ─────────────────────────────────── */}
                    <GlassCard className="p-8 flex flex-col h-full">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Send size={18} /> New Transmission
                        </h3>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4 mb-4 resize-none focus:outline-none focus:border-accent-primary transition-colors h-48 text-white placeholder:text-gray-600 text-sm"
                            placeholder="Dear Future Me..."
                        />

                        {error && (
                            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-3">
                                {error}
                            </p>
                        )}

                        <div className="flex items-center gap-3">
                            <input
                                type="date"
                                value={unlockDate}
                                onChange={(e) => setUnlockDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-accent-primary transition-colors"
                            />
                            <button
                                onClick={handleSend}
                                disabled={sending}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary text-white font-semibold text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-105 transition-all disabled:opacity-60 whitespace-nowrap"
                            >
                                {sending
                                    ? <><Loader2 size={14} className="animate-spin" /> Sealing…</>
                                    : <><Lock size={14} /> Lock & Send</>
                                }
                            </button>
                        </div>
                    </GlassCard>

                    {/* ── Time-Locked Capsules ──────────────────────────────── */}
                    <div className="space-y-4">
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Clock size={14} />
                            Time-Locked Capsules
                            {messages.length > 0 && (
                                <span className="ml-auto bg-accent-primary/20 text-accent-primary text-xs px-2 py-0.5 rounded-full font-bold">
                                    {messages.length}
                                </span>
                            )}
                        </h3>

                        {loading ? (
                            <div className="flex items-center justify-center gap-2 py-8 text-gray-500 text-sm">
                                <Loader2 size={16} className="animate-spin" />
                                Loading capsules…
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-12 text-gray-600 text-sm">
                                <Lock size={32} className="mx-auto mb-3 opacity-30" />
                                No capsules yet.<br />Send your first message to your future self!
                            </div>
                        ) : (
                            <AnimatePresence>
                                {messages.map((msg) => {
                                    const unlocked = isUnlocked(msg);
                                    const isConfirming = confirmDeleteId === msg.id;
                                    const isDeleting = deleting === msg.id;

                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                            layout
                                        >
                                            <GlassCard className={`p-4 transition-all ${unlocked ? "border-accent-primary/30 bg-accent-primary/5" : "opacity-80 hover:opacity-100"}`}>
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                                        <div className={`p-2 rounded-full flex-shrink-0 mt-0.5 ${unlocked ? "bg-accent-primary/20" : "bg-white/5"}`}>
                                                            {unlocked
                                                                ? <Unlock size={14} className="text-accent-primary" />
                                                                : <Lock size={14} className="text-gray-500" />
                                                            }
                                                        </div>
                                                        <div className="min-w-0">
                                                            {unlocked ? (
                                                                <p className="text-sm text-gray-200 break-words mb-1">
                                                                    {msg.content}
                                                                </p>
                                                            ) : (
                                                                <div className="text-sm font-bold text-gray-400 mb-1">
                                                                    ••••• Encrypted •••••
                                                                </div>
                                                            )}
                                                            <div className={`text-xs flex items-center gap-1 ${unlocked ? "text-accent-primary" : "text-gray-500"}`}>
                                                                <Clock size={10} />
                                                                {unlocked ? "Unlocked" : `Unlocks: ${formatDate(msg.unlockAt)}`}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Delete button */}
                                                    <button
                                                        onClick={() => handleDelete(msg.id)}
                                                        disabled={isDeleting}
                                                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${isConfirming
                                                                ? "bg-red-500/30 border border-red-400/50 text-red-300 animate-pulse"
                                                                : "bg-white/5 border border-white/10 text-gray-500 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400"
                                                            }`}
                                                    >
                                                        {isDeleting
                                                            ? <Loader2 size={10} className="animate-spin" />
                                                            : <Trash2 size={10} />
                                                        }
                                                        {isConfirming ? "Sure?" : "Delete"}
                                                    </button>
                                                </div>
                                            </GlassCard>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
