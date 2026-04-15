"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import IconifyIcon from "@/components/IconifyIcon";

export default function TimelineDemoPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0"></div>
            
            <Header />

            <main className="flex-grow flex items-center justify-center px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-md w-full glass rounded-[3rem] p-12 text-center border border-white/50 shadow-2xl"
                >
                    <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-slate-900/20">
                        <IconifyIcon icon="solar:timeline-up-linear" className="text-4xl text-white" />
                    </div>
                    <h1 className="text-3xl font-heading font-medium text-slate-900 tracking-tighter mb-4">
                        Timeline <span className="text-primary">Demo.</span>
                    </h1>
                    <p className="text-sm text-slate-500 font-light leading-relaxed mb-8">
                        This feature is currently in development. Check back soon for the interactive timeline experience.
                    </p>
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-primary transition-all shadow-lg"
                    >
                        <IconifyIcon icon="solar:arrow-left-linear" className="text-lg" />
                        Back to Home
                    </Link>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
