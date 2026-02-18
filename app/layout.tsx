import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClientLayout } from "@/components/layout/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Life.OS — The Emotional Operating System",
  description: "Run your memories. Preserve your evolution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen relative overflow-x-hidden bg-background text-foreground"
        )}
      >
        <div className="fixed inset-0 z-[-1] bg-[url('/noise.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
        {/* Placeholder for Particle Background */}
        <div id="stars-container" className="fixed inset-0 z-[-2]" />

        <main className="relative z-10 flex flex-col min-h-screen">
          <ClientLayout>
            {children}
          </ClientLayout>
        </main>
      </body>
    </html>
  );
}
