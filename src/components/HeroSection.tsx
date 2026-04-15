"use client";

import IconifyIcon from "./IconifyIcon";
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen pt-28 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-white flex items-center">
            {/* AI Grid & Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] z-0"></div>

            {/* Fluid Glow Orbs */}
            <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-1/4 w-[30rem] md:w-[40rem] h-[30rem] md:h-[40rem] bg-gradient-to-tr from-primary/10 to-orange-400/5 blur-[100px] rounded-full mix-blend-multiply pointer-events-none z-0"
            />
            <motion.div
                animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 right-1/4 w-[30rem] md:w-[45rem] h-[30rem] md:h-[45rem] bg-gradient-to-bl from-orange-500/5 to-primary/15 blur-[120px] rounded-full mix-blend-multiply pointer-events-none z-0"
            />

            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
                {/* Left: Text content */}
                <div className="relative z-10 flex flex-col items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-slate-800 shadow-[0_0_1rem_rgba(194,65,12,0.1)] mb-6 md:mb-8"
                    >
                        <div className="relative flex items-center justify-center w-4 h-4">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping"></span>
                            <IconifyIcon icon="solar:star-fall-linear" className="text-primary text-xs relative z-10"></IconifyIcon>
                        </div>
                        <span className="text-[10px] font-medium text-slate-300 uppercase tracking-[0.2em]">Future-Ready AI Career Intelligence</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl sm:text-6xl lg:text-[5.5rem] font-medium tracking-tighter text-slate-900 leading-[1.05] mb-6 md:mb-8 font-heading"
                    >
                        Your Career. <br />
                        <span className="text-gradient relative inline-block py-2">
                            Figured Out.
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30 opacity-70" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,10 Q50,20 100,10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path></svg>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-base sm:text-lg lg:text-xl font-light text-slate-600 mb-8 md:mb-10 max-w-lg leading-relaxed"
                    >
                        Most students graduate without a clue what to do next. UNIPATH gives you a clear path, tells you what skills you&apos;re missing, and preps you for every interview — so you walk in ready.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap items-center gap-3 w-full"
                    >
                        <a href="/career-discovery" className="relative overflow-hidden flex items-center justify-center gap-2 px-7 sm:px-10 py-4 text-sm font-medium text-white bg-slate-900 rounded-full shadow-lg hover:shadow-primary/20 transition-all duration-300 group flex-1 sm:flex-none min-w-0">
                            <div className="absolute inset-0 w-0 bg-primary transition-all duration-500 ease-out group-hover:w-full z-0"></div>
                            <span className="relative z-10 flex items-center gap-2 tracking-widest uppercase whitespace-nowrap">
                                Initialize Path
                                <IconifyIcon icon="solar:rocket-linear" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </span>
                        </a>

                        <button className="relative flex items-center justify-center gap-2 px-7 sm:px-10 py-4 text-sm font-medium text-slate-700 bg-white/80 backdrop-blur-md border border-slate-200 hover:border-primary/30 hover:bg-slate-50 rounded-full transition-all duration-300 flex-1 sm:flex-none group whitespace-nowrap">
                            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#C2410C] group-hover:animate-pulse"></div>
                            <span className="tracking-widest uppercase">For Schools</span>
                        </button>
                    </motion.div>
                </div>

                {/* Right Visual — hidden on mobile, shown from lg up */}
                <div className="relative w-full h-[28rem] lg:h-[32rem] items-center justify-center lg:justify-end perspective-[1000px] hidden lg:flex">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                        animate={{ opacity: 1, scale: 1, rotateY: -5 }}
                        transition={{ duration: 1.2, delay: 0.4 }}
                        className="relative w-[22rem] h-[28rem] bg-secondary/95 backdrop-blur-2xl rounded-[2.5rem] border border-slate-800/50 shadow-2xl p-6 flex flex-col gap-6 hover:border-primary/40 transition-colors duration-500 group/card"
                    >
                        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-red-400 transition-colors"></div>
                                <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-amber-400 transition-colors"></div>
                                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_#C2410C] animate-pulse"></div>
                            </div>
                            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest border border-slate-800 px-3 py-1 rounded-full bg-slate-800/50">
                                AI Engine Active
                            </div>
                        </div>

                        <div className="w-full h-32 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(194,65,12,0.15)_0%,transparent_70%)] opacity-50"></div>
                            <IconifyIcon icon="solar:programming-linear" className="text-6xl text-slate-800 absolute opacity-20" />
                            <div className="w-full h-full flex items-center justify-around px-6 relative z-10">
                                {[30, 60, 100, 80, 40].map((height, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 1, delay: 1 + (i * 0.1), ease: "easeOut" }}
                                        className={`w-1 ${i === 2 ? 'bg-white shadow-[0_0_15px_#fff]' : 'bg-primary shadow-[0_0_10px_#C2410C]'} rounded-full`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-28 rounded-2xl bg-slate-800/30 border border-slate-800 p-4 flex flex-col justify-between hover:bg-slate-800/50 transition-colors cursor-pointer group/item">
                                <IconifyIcon icon="solar:database-linear" className="text-emerald-400 text-2xl group-hover/item:scale-110 transition-transform" />
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Skill Gap</div>
                                    <div className="text-sm font-medium text-white">Analyzed</div>
                                </div>
                            </div>
                            <div className="h-28 rounded-2xl bg-primary/10 border border-primary/20 p-4 flex flex-col justify-between hover:bg-primary/20 transition-colors cursor-pointer group/item relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-12 h-12 bg-primary blur-xl opacity-30"></div>
                                <IconifyIcon icon="solar:cpu-bolt-linear" className="text-primary text-2xl relative z-10 group-hover/item:scale-110 transition-transform" />
                                <div className="relative z-10">
                                    <div className="text-[10px] text-orange-200/60 uppercase tracking-wider mb-1">Interview</div>
                                    <div className="text-sm font-medium text-orange-100">Ready</div>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-8 top-10 glass p-4 rounded-2xl shadow-xl z-20 hidden md:flex items-center gap-3 border-white/40"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <IconifyIcon icon="solar:code-circle-linear" className="text-primary text-xl" />
                            </div>
                            <div>
                                <div className="text-[10px] font-semibold text-slate-900">Expert Feedback</div>
                                <div className="text-[10px] text-slate-500">Real-time Analysis</div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute -left-12 bottom-12 glass-dark p-4 rounded-2xl shadow-2xl z-20 w-48 border-white/5"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Growth</span>
                                <span className="text-[10px] text-primary font-bold">98%</span>
                            </div>
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "98%" }}
                                    transition={{ duration: 1.5, delay: 1.5 }}
                                    className="h-full bg-gradient-to-r from-orange-500 to-primary"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
