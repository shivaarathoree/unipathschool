"use client";

import IconifyIcon from "./IconifyIcon";
import { motion } from "framer-motion";

const painPoints = [
    {
        num: "01",
        title: "Career Confusion",
        description: "Students often struggle to identify the path that best fits their strengths and current market demands.",
        icon: "solar:question-circle-linear",
        color: "bg-red-500/10 text-red-500",
    },
    {
        num: "02",
        title: "The Industry Gap",
        description: "Standard curriculums frequently lag behind rapid industry changes, leaving graduates without essential technical skills.",
        icon: "solar:diagram-down-linear",
        color: "bg-amber-500/10 text-amber-500",
    },
    {
        num: "03",
        title: "Interview Anxiety",
        description: "Many talented students fail initial screenings because they lack practice in structured, real-world technical interviews.",
        icon: "solar:close-circle-linear",
        color: "bg-primary/10 text-primary",
    },
];

export default function ProblemSection() {
    return (
        <section className="py-32 bg-secondary text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary text-sm font-medium tracking-[0.2em] uppercase mb-6 flex items-center gap-4"
                    >
                        <span className="w-12 h-px bg-primary"></span> The Challenge
                    </motion.div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-6xl font-medium font-heading tracking-tighter leading-tight"
                        >
                            Bridging the Gap <br />
                            Between <span className="text-primary">Theory & Reality.</span>
                        </motion.h2>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-lg font-light text-slate-400 max-w-lg leading-relaxed"
                        >
                            Traditional education provides the foundation, but the professional landscape requires precision. We use AI to identify and fill the critical gaps.
                        </motion.p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {painPoints.map((point, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i }}
                            className="group relative p-10 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                            
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="text-primary font-heading text-xl font-medium mb-8 tracking-widest">{point.num}</div>
                                
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${point.color} group-hover:scale-110 transition-transform duration-500`}>
                                    <IconifyIcon icon={point.icon} className="text-2xl" />
                                </div>
                                
                                <h3 className="text-2xl font-semibold font-heading text-white mb-4 tracking-tight">
                                    {point.title}
                                </h3>
                                
                                <p className="text-slate-400 font-light leading-relaxed">
                                    {point.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
