import Link from 'next/link';
import { ArrowRight, Brain, Shield, Zap } from 'lucide-react';
import { DailyWidget } from '@/components/ui/DailyWidget';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-900/20 blur-[100px]" />
      </div>



      <main className="relative z-10 flex flex-col items-center px-4 pt-20 text-center lg:pt-32">
        <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 backdrop-blur-md mb-8">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
          v2.0 Now Available
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight lg:text-7xl bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
          Your Emotional Operating System
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-400">
          Capture memories, track moods, and send messages to your future self.
          A secure, private sanctuary for your digital mind.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/register"
            className="group flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-black transition-transform hover:scale-105"
          >
            Start Your Journey <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10"
          >
            Live Demo
          </Link>
        </div>

        {/* Daily Widget — Time, Date, Quote */}
        <DailyWidget />

        <div className="mt-16 grid gap-8 md:grid-cols-3 text-left max-w-5xl w-full px-4">
          {[
            { title: 'Memory Vault', desc: 'Securely store life moments with encryption.', icon: Shield },
            { title: 'Mood Analytics', desc: 'Visualize your emotional trends over time.', icon: Zap },
            { title: 'Neural Design', desc: 'A calm, glassmorphic interface for focus.', icon: Brain },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <item.icon className="mb-4 text-indigo-400" size={32} />
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
