"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import IconifyIcon from "./IconifyIcon";

export default function FaangRoadmapSection() {
    const [handle, setHandle] = useState("");
    const router = useRouter();

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        let username = handle.trim();
        if (username.includes("leetcode.com/")) {
            const match = username.match(/leetcode\.com\/(?:u\/)?([^\/]+)/);
            if (match && match[1]) {
                username = match[1];
            }
        }
        if (!username) return;
        router.push(`/faang-roadmap?username=${encodeURIComponent(username)}`);
    };

    return (
        <section className="py-20 md:py-32 px-4 sm:px-6 relative bg-white overflow-hidden border-b border-slate-100">
            <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="inline-flex items-center gap-2 mb-8 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full shadow-sm">
                    <IconifyIcon icon="solar:code-circle-linear" className="text-primary text-lg" />
                    <span className="text-slate-300 font-medium text-[10px] tracking-[0.2em] uppercase">Engineering Readiness</span>
                </motion.div>
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-4xl md:text-6xl font-semibold font-heading text-slate-900 mb-6 md:mb-8 tracking-tighter">
                    FAANG <span className="text-primary">Roadmap</span>
                </motion.h2>
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                    className="text-base sm:text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                    Enter your LeetCode handle to receive a precise FAANG readiness score, a personalized week-by-week roadmap, and AI-driven practice recommendations.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="max-w-2xl mx-auto">
                    <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row items-center gap-4 p-2 bg-slate-50 border border-slate-200 rounded-[2rem] shadow-sm focus-within:border-primary/30 transition-all duration-300">
                        <div className="relative flex-grow w-full">
                            <IconifyIcon icon="simple-icons:leetcode" className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                            <input type="text" value={handle} onChange={(e) => setHandle(e.target.value)}
                                placeholder="LeetCode handle or URL (e.g. johndoe)"
                                className="w-full pl-14 pr-6 py-4 bg-transparent rounded-full focus:outline-none text-slate-900 placeholder:text-slate-400 font-sans text-sm tracking-wide"
                                required />
                        </div>
                        <button type="submit"
                            className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white font-semibold uppercase tracking-widest text-[10px] rounded-full hover:bg-primary transition-all duration-500 shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 whitespace-nowrap group">
                            Generate
                            <IconifyIcon icon="solar:arrow-right-linear" className="text-lg group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </motion.div>
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
        </section>
    );
}
