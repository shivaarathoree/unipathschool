"use client";

import IconifyIcon from "./IconifyIcon";
import { motion } from "framer-motion";

export default function SchoolsSection() {
    return (
        <section id="schools" className="py-20 md:py-32 bg-white relative overflow-hidden border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="flex flex-col group p-8 md:p-12 bg-slate-50 border border-slate-200 rounded-[2rem] md:rounded-[3rem] hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-10">
                                <span className="inline-block px-4 py-1.5 text-[10px] font-semibold text-primary border border-primary/20 rounded-full bg-primary/5 tracking-[0.2em] uppercase">B2B Platform</span>
                            </div>
                            <h3 className="text-3xl lg:text-4xl font-medium font-heading text-slate-900 mb-6 tracking-tighter leading-tight">
                                Built for Schools that <span className="text-primary">Care About Outcomes.</span>
                            </h3>
                            <p className="text-lg text-slate-500 font-light leading-relaxed mb-12">
                                Equip your institution with real-time placement analytics, student tracking, and AI Interview Labs.
                            </p>
                            <div className="flex-grow mb-12">
                                <ul className="space-y-4">
                                    {['Institution Analytics Dashboard', 'Real-time Student Tracking', 'AI Interview Lab Integration'].map((feature) => (
                                        <li key={feature} className="flex items-center gap-4 text-sm text-slate-700 font-medium">
                                            <IconifyIcon icon="solar:check-circle-linear" className="text-primary text-lg" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button className="w-full py-4 px-8 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all duration-500 shadow-lg hover:shadow-primary/20">
                                Request School Demo
                            </button>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="flex flex-col p-8 md:p-12 bg-slate-900 border border-slate-800 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-700"></div>
                        <div className="relative z-10 h-full flex flex-col justify-center">
                            <div className="text-primary mb-8">
                                <IconifyIcon icon="solar:quote-left-linear" className="text-5xl opacity-40" />
                            </div>
                            <p className="text-2xl lg:text-3xl text-white font-light leading-snug mb-12 tracking-tight italic">
                                &ldquo;UNIPATH helped me realize exactly what skills I lacked. The AI interview practice was surgical and gave me the absolute confidence to pass my actual technical screen.&rdquo;
                            </p>
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 p-0.5">
                                    <div className="w-full h-full rounded-[0.9rem] bg-slate-800 flex items-center justify-center text-slate-500">
                                        <IconifyIcon icon="solar:user-linear" className="text-2xl" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold text-white font-heading tracking-tight">Computer Science Graduate</h4>
                                    <span className="text-xs text-primary font-bold tracking-widest uppercase">Placed at Fortune 500</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
