"use client";

import { motion } from "framer-motion";
import ParticleBackground from "@/components/3d/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";
import { GlowingButton } from "@/components/ui/GlowingButton";
import { memories } from "@/lib/data";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-accent-secondary tracking-[0.2em] font-medium text-sm md:text-base uppercase mb-4 mt-4">
            The Emotional Operating System
          </h2>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            Life.OS
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg md:text-2xl text-gray-300 max-w-2xl mb-12 font-light leading-relaxed glass rounded-xl p-6 border-none bg-white/5"
        >
          "Your life is not just lived — it is processed, preserved, and evolved."
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex flex-col md:flex-row gap-6"
        >
          <Link href="/timeline">
            <GlowingButton variant="primary" className="text-lg px-10 py-4">
              Enter Memory Vault
            </GlowingButton>
          </Link>
          <Link href="/add">
            <GlowingButton variant="secondary" className="text-lg px-10 py-4">
              Log Code Moment
            </GlowingButton>
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-gray-500">Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-accent-primary to-transparent" />
        </motion.div>
      </section>

      {/* Feature Preview Section (Parallax-like) */}
      <section className="py-24 px-6 relative z-10 max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          { title: "Memory Timeline", desc: "Visualize your life's journey through a vertical stream of processed moments." },
          { title: "Mood Analysis", desc: "Track your emotional evolution with data-driven insights." },
          { title: "Message Vault", desc: "Send secure transmissions to your future self." },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="glass-card p-8 rounded-2xl hover:bg-white/10 transition-colors cursor-default border border-white/5"
          >
            <h3 className="text-xl font-bold mb-4 text-accent-foreground">{item.title}</h3>
            <p className="text-gray-400 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* System Vitals Section */}
      <section className="py-20 relative z-10 border-t border-white/5 bg-black/20">
        <Link href="/dashboard" className="block max-w-7xl mx-auto px-6 group cursor-pointer">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 flex justify-between items-end"
          >
            <div>
              <h2 className="text-3xl font-light tracking-wide mb-2 group-hover:text-accent-primary transition-colors">System Vitals</h2>
              <div className="w-24 h-0.5 bg-accent-primary opacity-50 group-hover:w-32 transition-all duration-300"></div>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Click to Analyze &rarr;</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: "Memory Integrity", value: "98%", color: "bg-green-500" },
              { label: "Emotional Stability", value: "Optimal", color: "bg-blue-500" },
              { label: "Days Tracked", value: "342", color: "bg-purple-500" },
              { label: "Vault Status", value: "Secure", color: "bg-amber-500" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl text-center hover:border-white/20 transition-all"
              >
                <div className={`w-2 h-2 rounded-full ${stat.color} mx-auto mb-4 shadow-[0_0_10px_currentColor]`} />
                <div className="text-4xl font-bold mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Link>
      </section>

      {/* Latest Memories Section */}
      <section className="py-24 px-6 relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div>
            <h2 className="text-4xl font-semibold tracking-tight mb-4 text-white">
              Recent Encodings
            </h2>
            <div className="w-full md:w-24 h-1 bg-accent-primary rounded-full opacity-80 shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
          </div>
          <Link href="/timeline">
            <button className="group relative px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:border-accent-primary/50 text-white transition-all duration-300 overflow-hidden backdrop-blur-sm">
              <span className="relative z-10 flex items-center gap-2 font-medium tracking-wide text-sm uppercase text-accent-primary group-hover:text-white transition-colors">
                View Archive
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-accent-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {memories.slice(0, 3).map((memory, i) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative flex flex-col h-full min-h-[420px] rounded-2xl overflow-hidden glass-card border border-white/5 bg-black/40 hover:border-accent-primary/30 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)] transition-all duration-500"
            >
              {/* Image Background */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-60 transition-opacity duration-700 mix-blend-overlay"
                style={{ backgroundImage: `url(${memory.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />

              {/* Hover Border Gradient */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent-primary/20 rounded-2xl transition-all duration-500 pointer-events-none" />

              {/* Content Container - Flex Column for strict alignment */}
              <div className="relative z-10 flex flex-col h-full p-8">

                {/* Top Row: Mood Badge & Date */}
                <div className="flex justify-between items-center mb-6">
                  <div className="px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 backdrop-blur-md shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                    <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest">{memory.mood}</span>
                  </div>
                  <span className="text-xs font-mono text-gray-500 group-hover:text-gray-300 transition-colors">
                    {memory.date}
                  </span>
                </div>

                {/* Title - Fixed height expectation via line-clamp */}
                <h3 className="text-2xl font-bold text-white mb-3 leading-tight line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                  {memory.title}
                </h3>

                {/* Description - Fixed height via line-clamp */}
                <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3">
                  {memory.description}
                </p>

                {/* Bottom Action - Pushed to bottom with mt-auto */}
                <div className="mt-auto pt-6 border-t border-white/5 group-hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between group cursor-pointer">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider group-hover:text-white transition-colors">Access Memory</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-accent-primary/50 group-hover:bg-accent-primary group-hover:text-white transition-all duration-300 shadow-lg">
                      <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy / Quote Section */}
      <section className="py-32 relative z-10 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-thin italic leading-relaxed text-gray-300"
          >
            "We do not remember days, we remember moments. The Life.OS is designed to capture the signal amidst the noise."
          </motion.blockquote>
        </div>
      </section>

    </main>
  );
}
