"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowingButton } from "@/components/ui/GlowingButton";

interface LockScreenProps {
    onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const handleInput = (num: string) => {
        if (pin.length < 4) {
            setPin((prev) => prev + num);
            setError(false);
        }
    };

    const handleBackspace = () => {
        setPin((prev) => prev.slice(0, -1));
        setError(false);
    };

    const handleClear = () => {
        setPin("");
        setError(false);
    };

    const handleSubmit = () => {
        // Mock PIN is 1234
        if (pin === "1234") {
            onUnlock();
        } else {
            setError(true);
            setPin("");
        }
    };

    useEffect(() => {
        if (pin.length === 4) {
            const timer = setTimeout(handleSubmit, 200); // Small delay for visual feedback
            return () => clearTimeout(timer);
        }
    }, [pin]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (/^[0-9]$/.test(e.key)) {
                handleInput(e.key);
                setActiveKey(e.key);
                setTimeout(() => setActiveKey(null), 150);
            } else if (e.key === "Backspace") {
                handleBackspace();
                setActiveKey("backspace");
                setTimeout(() => setActiveKey(null), 150);
            } else if (e.key === "Escape" || e.key === "c") {
                handleClear();
                setActiveKey("clear");
                setTimeout(() => setActiveKey(null), 150);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [pin]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md px-4"
            >
                <GlassCard className="p-8 flex flex-col items-center">
                    <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/10">
                        {error ? <Lock className="text-red-500" size={32} /> : <Lock className="text-accent-primary" size={32} />}
                    </div>

                    <h2 className="text-2xl font-bold mb-2">Private Vault</h2>
                    <p className="text-gray-400 mb-8 text-sm">Enter PIN to access</p>

                    <div className="flex gap-4 mb-8">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`w-4 h-4 rounded-full transition-colors ${i < pin.length
                                    ? error ? "bg-red-500" : "bg-accent-primary"
                                    : "bg-white/10"
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 w-full mb-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                onClick={() => handleInput(num.toString())}
                                className={`h-16 rounded-xl transition-colors text-xl font-bold ${activeKey === num.toString() ? "bg-accent-primary text-white scale-95" : "bg-white/5 hover:bg-white/10"
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            onClick={handleClear}
                            className={`h-16 rounded-xl transition-colors flex items-center justify-center ${activeKey === "clear" ? "bg-white/20 scale-95" : "bg-white/5 hover:bg-white/10"
                                }`}
                        >
                            <span className="text-sm font-medium uppercase tracking-wider">CLR</span>
                        </button>
                        <button
                            onClick={() => handleInput("0")}
                            className={`h-16 rounded-xl transition-colors text-xl font-bold ${activeKey === "0" ? "bg-accent-primary text-white scale-95" : "bg-white/5 hover:bg-white/10"
                                }`}
                        >
                            0
                        </button>
                        <button
                            onClick={handleBackspace}
                            className={`h-16 rounded-xl transition-colors flex items-center justify-center ${activeKey === "backspace" ? "bg-white/20 scale-95" : "bg-white/5 hover:bg-white/10"
                                }`}
                        >
                            ←
                        </button>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
}
