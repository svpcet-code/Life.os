"use client";

import React, { createContext, useContext, useState } from "react";

interface ImmersiveContextType {
    isImmersive: boolean;
    toggleImmersive: () => void;
    enableImmersive: () => void;
    disableImmersive: () => void;
}

const ImmersiveContext = createContext<ImmersiveContextType | undefined>(undefined);

export function ImmersiveProvider({ children }: { children: React.ReactNode }) {
    const [isImmersive, setIsImmersive] = useState(false);

    const toggleImmersive = () => setIsImmersive(!isImmersive);
    const enableImmersive = () => setIsImmersive(true);
    const disableImmersive = () => setIsImmersive(false);

    return (
        <ImmersiveContext.Provider value={{ isImmersive, toggleImmersive, enableImmersive, disableImmersive }}>
            {children}
        </ImmersiveContext.Provider>
    );
}

export function useImmersive() {
    const context = useContext(ImmersiveContext);
    if (context === undefined) {
        throw new Error("useImmersive must be used within an ImmersiveProvider");
    }
    return context;
}
