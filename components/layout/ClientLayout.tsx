"use client";

import { AuthProvider } from "@/lib/contexts/AuthContext";
import { ImmersiveProvider, useImmersive } from "@/lib/contexts/ImmersiveContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { isImmersive } = useImmersive();
    const pathname = usePathname();

    return (
        <>
            <AnimatePresence mode="wait">
                {!isImmersive && <Navbar key="navbar" />}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col"
                >
                    {children}
                </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {!isImmersive && <Footer key="footer" />}
            </AnimatePresence>
        </>
    );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ImmersiveProvider>
                <LayoutContent>{children}</LayoutContent>
            </ImmersiveProvider>
        </AuthProvider>
    );
}
