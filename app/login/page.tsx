"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Fingerprint, ArrowRight } from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import ParticleBackground from "@/components/3d/ParticleBackground";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);
        // Simulate biometric/auth delay
        setTimeout(() => {
            login();
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <main className="min-h-screen relative bg-black flex flex-col items-center justify-center overflow-hidden">
            <ParticleBackground />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-0" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-md p-8"
            >
                <div className="glass-card p-10 rounded-3xl border border-white/10 backdrop-blur-xl flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                        <Lock className="text-white/80" size={32} />
                    </div>

                    <h1 className="text-3xl font-light tracking-widest mb-2 text-white">SECURE ACCESS</h1>
                    <p className="text-gray-500 mb-10 text-sm uppercase tracking-wider">Life.OS v2.0 Identity Verification</p>

                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="group relative w-24 h-24 rounded-full border border-accent-primary/50 flex items-center justify-center mb-6 hover:scale-110 transition-transform duration-500"
                    >
                        {isLoading ? (
                            <div className="w-16 h-16 border-2 border-t-accent-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                        ) : (
                            <Fingerprint size={48} className="text-accent-primary group-hover:text-white transition-colors duration-500" />
                        )}
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-accent-primary pointer-events-none" />
                    </button>

                    <p className="text-xs text-gray-600 font-mono mb-8">
                        {isLoading ? "AUTHENTICATING BIOMETRICS..." : "TOUCH TO DECRYPT NEURAL LINK"}
                    </p>

                    <div className="w-full flex justify-between items-center text-xs text-gray-500 px-4">
                        <span>SYSTEM: ONLINE</span>
                        <span>ENCRYPTION: AES-256</span>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
