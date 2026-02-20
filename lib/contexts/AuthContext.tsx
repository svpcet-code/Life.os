"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    setIsAuthenticated(true);
                    localStorage.setItem("lifeos_auth", "true");
                } else {
                    setIsAuthenticated(false);
                    localStorage.removeItem("lifeos_auth");
                }
            } catch (error) {
                console.error("Auth check failed", error);
                setIsAuthenticated(false);
                localStorage.removeItem("lifeos_auth");
            }
        };
        checkAuth();
    }, []);

    const login = () => {
        localStorage.setItem("lifeos_auth", "true");
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            localStorage.removeItem("lifeos_auth");
            setIsAuthenticated(false);
            window.location.assign('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
