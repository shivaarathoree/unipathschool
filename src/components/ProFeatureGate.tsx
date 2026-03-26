"use client";

import Link from "next/link";
import IconifyIcon from "./IconifyIcon";
import { motion } from "framer-motion";

interface ProFeatureGateProps {
    title: string;
}

export default function ProFeatureGate({ title }: ProFeatureGateProps) {
    return (
        <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0"></div>
            
            <main className="flex-grow flex items-center justify-center px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    className="max-w-2xl w-full glass rounded-[3rem] p-12 lg:p-16 text-center border border-white/50 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[8rem] -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-slate-900/20">
                            <IconifyIcon icon="solar:lock-keyhole-linear" className="text-4xl text-white" />
                        </div>
                        
                        <div className="space-y-4 mb-12">
                            <h2 className="text-4xl md:text-5xl font-heading font-medium text-slate-900 tracking-tighter">
                                Pro <span className="text-primary">Feature.</span>
                            </h2>
                            <p className="text-lg text-slate-500 font-light leading-relaxed max-w-md mx-auto">
                                <span className="font-medium text-slate-900">{title}</span> is available on the Pro plan. Sign in or upgrade to get access.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm mx-auto">
                            <Link href="/login" className="group flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all duration-500">
                                Upgrade Now
                                <IconifyIcon icon="solar:star-fall-linear" className="text-lg group-hover:rotate-12 transition-transform" />
                            </Link>
                            <Link href="/" className="flex items-center justify-center gap-3 px-8 py-5 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-slate-100 transition-all border border-slate-100">
                                Back to Home
                            </Link>
                        </div>

                        <div className="mt-12 pt-10 border-t border-slate-100 flex justify-center gap-8">
                            <div className="flex items-center gap-2">
                                <IconifyIcon icon="solar:check-read-linear" className="text-primary" />
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Full AI Access</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IconifyIcon icon="solar:check-read-linear" className="text-primary" />
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Expert Roadmaps</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}