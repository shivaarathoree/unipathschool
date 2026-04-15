"use client";

import { motion } from "framer-motion";
import IconifyIcon from "./IconifyIcon";
import Link from "next/link";

const outcomes = [
    {
        stat: "3 min",
        label: "To your first career match",
        icon: "solar:clock-circle-linear",
        description: "Answer a few questions. Our AI maps your best-fit career path before your tea gets cold.",
    },
    {
        stat: "6 tools",
        label: "One coherent platform",
        icon: "solar:widget-5-linear",
        description: "Discovery, gap analysis, FAANG prep, interview practice, company drills, progress tracking — all connected.",
    },
    {
        stat: "0 fluff",
        label: "Only what moves you forward",
        icon: "solar:target-linear",
        description: "Every recommendation, roadmap, and question set is built on real hiring data — not generic advice.",
    },
];

export default function HowItWorksSection() {
    return (
        <section className="py-20 md:py-28 bg-slate-950 text-white relative overflow-hidden border-y border-slate-900">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C2410C 1px, transparent 1px)', backgroundSize: '2.5rem 2.5rem' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[20rem] bg-primary/8 blur-[140px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-primary text-sm font-medium tracking-[0.2em] uppercase mb-5 flex items-center gap-4"
                        >
                            <span className="w-12 h-px bg-primary"></span> Why it works
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 }}
                            className="text-3xl sm:text-4xl md:text-5xl font-medium font-heading tracking-tighter leading-tight"
                        >
                            Built around <span className="text-primary">your outcome.</span><br />
                            Not a generic plan.
                        </motion.h2>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link
                            href="/career-discovery"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-700 text-slate-300 text-[10px] font-bold tracking-[0.2em] uppercase hover:border-primary hover:text-primary transition-all duration-300 group"
                        >
                            Start for free
                            <IconifyIcon icon="solar:arrow-right-linear" className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {outcomes.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i }}
                            className="group flex flex-col bg-slate-900/60 border border-slate-800 rounded-[1.75rem] md:rounded-[2rem] p-7 md:p-10 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-6 md:mb-8">
                                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                                    <IconifyIcon icon={item.icon} className="text-primary text-lg md:text-xl" />
                                </div>
                                <span className="text-3xl md:text-4xl font-bold font-heading text-primary tracking-tight tabular-nums">
                                    {item.stat}
                                </span>
                            </div>

                            <h3 className="text-sm md:text-base font-semibold text-white mb-2 tracking-tight font-heading">
                                {item.label}
                            </h3>
                            <p className="text-sm text-slate-400 font-light leading-relaxed flex-grow">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
