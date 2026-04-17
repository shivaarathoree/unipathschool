"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import IconifyIcon from "./IconifyIcon";

const companies = [
    { name: "Google", icon: "logos:google-icon", questions: 52, difficulty: "Hard", color: "from-blue-500/10 to-blue-600/5", badge: "bg-blue-50 text-blue-600 border-blue-200" },
    { name: "Amazon", icon: "logos:aws", questions: 81, difficulty: "Medium-Hard", color: "from-orange-500/10 to-orange-600/5", badge: "bg-orange-50 text-orange-600 border-orange-200" },
    { name: "Microsoft", icon: "logos:microsoft-icon", questions: 96, difficulty: "Medium", color: "from-green-500/10 to-green-600/5", badge: "bg-green-50 text-green-600 border-green-200" },
    { name: "Adobe", icon: "simple-icons:adobe", iconColor: "text-[#FF0000]", questions: 42, difficulty: "Medium-Hard", color: "from-red-500/10 to-red-600/5", badge: "bg-red-50 text-red-600 border-red-200" },
];

export default function CompanyPracticeSection() {
    return (
        <section className="py-20 md:py-32 px-4 sm:px-6 relative bg-secondary overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-[30rem] md:w-[40rem] h-[30rem] md:h-[40rem] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-center mb-8"
                >
                    <div className="text-primary text-sm font-medium tracking-[0.2em] uppercase mb-6 flex items-center justify-center gap-4">
                        <span className="w-12 h-px bg-primary"></span> Company-Wise Practice <span className="w-12 h-px bg-primary"></span>
                    </div>
                </motion.div>

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl sm:text-4xl md:text-6xl font-medium font-heading text-white mb-6 tracking-tighter text-center leading-tight"
                >
                    Practice for Your <br />
                    <span className="text-primary">Dream Company.</span>
                </motion.h2>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-base md:text-lg font-light text-slate-400 max-w-2xl mx-auto leading-relaxed text-center mb-12"
                >
                    Curated interview question sheets from top FAANG companies — filtered by difficulty, category, and topic.
                </motion.p>

                {/* Company Cards Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 mb-12"
                >
                    {companies.map((company, i) => (
                        <Link href={`/company-sheets/${company.name.toLowerCase()}`} key={company.name}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + i * 0.08 }}
                                className={`relative group bg-slate-900/50 border border-slate-800 hover:border-primary/40 rounded-[2rem] p-6 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden h-full flex flex-col`}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl group-hover:bg-primary/20 transition-colors duration-500"></div>

                                {/* Icon */}
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 relative z-10">
                                    <IconifyIcon icon={company.icon} className={`text-2xl ${company.iconColor || ""}`} />
                                </div>

                                {/* Name */}
                                <h3 className="font-heading font-semibold text-white text-lg mb-2 relative z-10">{company.name}</h3>

                                {/* Count */}
                                <p className="text-sm text-slate-400 font-light mb-5 flex-grow relative z-10">{company.questions}+ Questions</p>

                                {/* Difficulty badge */}
                                <div className="relative z-10 w-full">
                                    <span className={`inline-block px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border rounded-full bg-slate-900 border-slate-700 text-slate-300 group-hover:border-primary/50 group-hover:text-primary transition-colors`}>
                                        {company.difficulty}
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>

                {/* CTA Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-2 bg-slate-900/50 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-md">
                        {/* Left info */}
                        <div className="flex items-center gap-4 flex-grow px-5 py-3 w-full sm:w-auto">
                            <div className="flex -space-x-3">
                                {["logos:google-icon", "logos:aws", "logos:microsoft-icon", "simple-icons:adobe"].map((icon, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 shadow-md flex items-center justify-center relative z-10">
                                        <IconifyIcon icon={icon} className={`text-lg ${icon === "simple-icons:adobe" ? "text-red-500" : ""}`} />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">4 Top Companies</p>
                                <p className="text-[11px] text-slate-400 font-light mt-0.5">271+ curated problems</p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Link
                            href="/company-sheets"
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-[11px] rounded-2xl hover:bg-primary-dark transition-all duration-500 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 whitespace-nowrap group"
                        >
                            Explore Sheets
                            <IconifyIcon icon="solar:arrow-right-linear" className="text-lg group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>

                {/* Pro badge line */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center justify-center gap-2 mt-8 text-[11px] text-slate-400 font-medium tracking-wide"
                >
                    <IconifyIcon icon="solar:lock-keyhole-linear" className="text-primary text-sm" />
                    Available exclusively on the <span className="font-bold text-primary">Pro Plan</span>
                </motion.p>
            </div>
        </section>
    );
}
