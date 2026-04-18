"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0" />

            <Header />

            <main className="flex-grow flex items-center justify-center px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-lg w-full text-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-[8rem] font-heading font-semibold text-slate-100 leading-none tracking-tighter select-none mb-4"
                    >
                        404
                    </motion.div>

                    <div className="w-16 h-px bg-primary/30 mx-auto mb-8" />

                    <h1 className="text-3xl font-heading font-semibold text-slate-900 tracking-tighter mb-4">
                        Page Not Found.
                    </h1>
                    <p className="text-sm text-slate-500 font-light leading-relaxed mb-10 max-w-sm mx-auto">
                        The page you are looking for does not exist or has been moved. Head back to the homepage to get back on track.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="bg-slate-900 hover:bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all duration-500 shadow-xl hover:shadow-primary/20"
                        >
                            Go Home
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 border border-slate-200 hover:border-slate-900 px-8 py-4 rounded-full transition-all"
                        >
                            Dashboard
                        </Link>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
