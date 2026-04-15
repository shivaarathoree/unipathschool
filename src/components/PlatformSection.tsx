"use client";

import IconifyIcon from "./IconifyIcon";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
    {
        icon: "solar:magnifer-linear",
        title: "AI Career Discovery",
        description: "Stop guessing. Tell us your interests, your stream, and where you want to be — our AI maps the career that was always meant for you.",
        color: "bg-blue-500/10 text-blue-500",
        href: "/career-discovery",
    },
    {
        icon: "solar:code-circle-linear",
        title: "Engineering Readiness",
        description: "Enter your LeetCode handle and get a real FAANG readiness score — with a personalised week-by-week roadmap to close the gap.",
        color: "bg-emerald-500/10 text-emerald-500",
        badge: "FAANG Roadmap",
        href: "/faang-roadmap",
    },
    {
        icon: "solar:scanner-linear",
        title: "Skill Gap Analyzer",
        description: "Our AI compares your current profile against real job requirements and tells you exactly what's missing — with a fix for each gap.",
        color: "bg-amber-500/10 text-amber-500",
    },
    {
        icon: "solar:microphone-linear",
        title: "AI Interview Prep",
        description: "Practise with questions pulled from actual company interviews. Get real feedback on your answers, not just a score.",
        color: "bg-indigo-500/10 text-indigo-500",
        hasPulse: true,
        href: "/ai-interview",
    },
    {
        icon: "solar:buildings-3-linear",
        title: "Company Wise Practice",
        description: "Drill interview patterns for Google, Amazon, Meta, and the company you actually want to work at. FAANG-level prep, built for everyone.",
        color: "bg-violet-500/10 text-violet-500",
        href: "/company-sheets",
    },
    {
        icon: "solar:pie-chart-linear",
        title: "Progress Dashboard",
        description: "See your readiness score move in real time. Know exactly how close you are to being job-ready — before any recruiter tells you otherwise.",
        color: "bg-rose-500/10 text-rose-500",
        href: "/dashboard",
    },
];

export default function PlatformSection() {
    return (
        <section id="platform" className="py-20 md:py-32 bg-white relative overflow-hidden border-b border-slate-100">
            {/* Background Accent */}
            <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="mb-12 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary text-sm font-medium tracking-[0.2em] uppercase mb-6 flex items-center gap-4"
                    >
                        <span className="w-12 h-px bg-primary"></span> The Platform
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-end">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl sm:text-4xl md:text-6xl font-medium font-heading tracking-tighter leading-tight text-slate-900"
                        >
                            Everything you need <br />
                            <span className="text-primary">to get hired.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-base md:text-lg font-light text-slate-500 max-w-lg leading-relaxed"
                        >
                            Six tools. One platform. Built to take you from &ldquo;I don&apos;t know where to start&rdquo; to your first offer letter.
                        </motion.p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.08 * i }}
                            className="group relative p-7 sm:p-8 md:p-12 bg-white hover:bg-slate-50 transition-all duration-500"
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-5 md:mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-500 relative`}>
                                    {feature.hasPulse && (
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                        </span>
                                    )}
                                    <IconifyIcon icon={feature.icon} className="text-xl md:text-2xl" />
                                </div>

                                {feature.badge && (
                                    <span className="inline-block mb-3 px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.18em] uppercase border border-emerald-200 bg-emerald-50 text-emerald-600">
                                        {feature.badge}
                                    </span>
                                )}

                                <h3 className="text-base md:text-xl font-semibold font-heading text-slate-900 mb-3 tracking-tight">
                                    {feature.title}
                                </h3>

                                <p className="text-sm md:text-base text-slate-500 font-light leading-relaxed mb-6 md:mb-8 flex-grow">
                                    {feature.description}
                                </p>

                                {feature.href ? (
                                    <Link href={feature.href} className="inline-flex items-center gap-2 text-primary text-xs font-semibold tracking-widest uppercase group-hover:gap-3 transition-all">
                                        Explore <IconifyIcon icon="solar:arrow-right-linear" />
                                    </Link>
                                ) : (
                                    <span className="text-slate-300 text-[10px] font-medium tracking-[0.2em] uppercase">Coming Soon</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
