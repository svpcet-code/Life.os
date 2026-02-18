"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { ComponentProps } from "react";

interface GlowingButtonProps extends ComponentProps<typeof motion.button> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "danger";
}

export function GlowingButton({ children, className, variant = "primary", ...props }: GlowingButtonProps) {
    const baseStyles = "px-8 py-3 rounded-full font-medium transition-all duration-300 relative overflow-hidden group";

    const variants = {
        primary: "bg-accent-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]",
        secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
        danger: "bg-red-500/80 text-white hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            {variant === "primary" && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
            )}
        </motion.button>
    );
}
