"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import IconifyIcon from "./IconifyIcon";

export default function CTASection() {
    return (
        <section className="py-20 md:py-32 bg-slate-950 text-white relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(194,65,12,0.3) 1px, transparent 0)', backgroundSize: '2.5rem 2.5rem' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[30rem] bg-primary/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-[10px] font-bold text-primary tracking-[0.2em] uppercase mb-8 md:mb-10"
                >
                    Your first step is free
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-7xl font-medium font-heading tracking-tighter text-white mb-10 md:mb-16 leading-[1.1]"
                >
                    Know where you&apos;re going. <br />
                    <span className="text-primary">Start today.</span>
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
                >
                    <Link href="/login" className="relative w-full py-4 sm:py-5 px-8 sm:px-10 rounded-full bg-white text-slate-900 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-500 text-center shadow-xl group">
                        Become a Member
                        <IconifyIcon icon="solar:arrow-right-up-linear" className="inline-block ml-2 text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                    <Link href="/career-discovery" className="relative w-full py-4 sm:py-5 px-8 sm:px-10 rounded-full border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all duration-500 text-center">
                        Start for Free
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
