"use client";

import IconifyIcon from "./IconifyIcon";
import { motion } from "framer-motion";

export default function DeepDiveSection() {
    return (
        <section className="py-20 md:py-32 bg-white relative overflow-hidden border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="col-span-12 md:col-span-6 bg-slate-50 border border-slate-200 rounded-[2rem] md:rounded-[3rem] p-7 md:p-10 lg:p-14 flex flex-col justify-between overflow-hidden relative group"
                    >
                        <div className="relative z-10">
                            <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block px-4 py-1.5 text-[10px] font-semibold text-primary border border-primary/20 rounded-full bg-primary/5 mb-8 tracking-[0.2em] uppercase">Core Engine</motion.span>
                            <h3 className="text-2xl md:text-3xl lg:text-4xl text-slate-900 font-medium tracking-tighter mb-6 font-heading leading-tight">Precision <span className="text-primary">Skill-Gap</span> Analysis.</h3>
                            <p className="text-sm md:text-base text-slate-500 leading-relaxed font-light mb-8 md:mb-12 max-w-md">Our AI deep-dives into industry requirements and benchmarks them against your profile to create a surgical improvement plan.</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-8 relative overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
                            <div className="flex items-center justify-between mb-6 md:mb-8 pb-4 md:pb-6 border-b border-slate-100">
                                <span className="text-xs font-semibold text-slate-900 tracking-tight uppercase">Target: Software Engineer</span>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase">Verified</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-4">Required</span>
                                    <ul className="space-y-3">
                                        {['Python', 'Data Structures', 'Git', 'System Design'].map((skill, i) => (
                                            <li key={skill} className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                                                <IconifyIcon icon={i < 2 ? "solar:check-circle-linear" : "solar:minus-circle-linear"} className={i < 2 ? "text-primary" : "text-slate-300"} />
                                                {skill}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 md:p-6">
                                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest block mb-4">Missing</span>
                                    <div className="flex flex-col gap-3">
                                        <span className="px-3 py-1.5 bg-white text-primary text-[10px] font-bold rounded-lg border border-primary/10 shadow-sm text-center">Git</span>
                                        <span className="px-3 py-1.5 bg-white text-primary text-[10px] font-bold rounded-lg border border-primary/10 shadow-sm text-center">System Design</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="col-span-12 md:col-span-6 bg-slate-900 border border-slate-800 rounded-[2rem] md:rounded-[3rem] p-7 md:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-[20rem] h-[20rem] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
                        <div className="relative z-10">
                            <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block px-4 py-1.5 text-[10px] font-semibold text-primary border border-primary/20 rounded-full bg-primary/10 mb-8 tracking-[0.2em] uppercase">Premium Feature</motion.span>
                            <h3 className="text-2xl md:text-3xl lg:text-4xl text-white font-medium tracking-tighter mb-6 font-heading leading-tight">AI Interviews that <span className="text-primary">Feel Real.</span></h3>
                            <p className="text-sm md:text-base text-slate-400 leading-relaxed font-light mb-8 md:mb-12 max-w-md">Practice high-stakes scenarios with dynamic feedback. Get surgical insights into your communication and technical logic.</p>
                        </div>
                        <div className="space-y-4 relative z-10">
                            {[
                                { icon: "solar:chart-2-linear", text: "Communication Clarity", score: "92%" },
                                { icon: "solar:code-circle-linear", text: "Technical Logic", score: "88%" },
                                { icon: "solar:user-heart-linear", text: "Confidence Index", score: "95%" }
                            ].map((item, i) => (
                                <motion.div key={i} whileHover={{ x: 10 }} className="bg-slate-800/50 border border-slate-700 p-4 md:p-5 rounded-2xl flex items-center justify-between group/item hover:border-primary/50 transition-all duration-300">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                                            <IconifyIcon icon={item.icon} />
                                        </div>
                                        <span className="text-sm font-medium text-white">{item.text}</span>
                                    </div>
                                    <span className="text-primary font-bold tracking-widest text-sm md:text-base">{item.score}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
