"use client";

import { motion } from "framer-motion";
import IconifyIcon from "./IconifyIcon";

const steps = [
    {
        number: "01",
        title: "Validation & Scope",
        description: "We analyze your academic vision, validate core strengths, and architect your technical foundation.",
        icon: "solar:magnifer-linear",
    },
    {
        number: "02",
        title: "Career Architecture",
        description: "Crafting the blueprint. We select optimal paths and map out secure, scalable user journeys.",
        icon: "solar:route-linear",
    },
    {
        number: "03",
        title: "Skill Acquisition",
        description: "Guided, personalized roadmaps designed to fill the exact gaps identified by our AI engine.",
        icon: "solar:pen-new-square-linear",
    },
    {
        number: "04",
        title: "AI Simulation",
        description: "Practice high-stakes hiring scenarios with dynamic, structured feedback from our AI interviewer.",
        icon: "solar:code-square-linear",
    },
    {
        number: "05",
        title: "Launch & Scale",
        description: "Deploy your skills into the market with verified confidence and real-world project readiness.",
        icon: "solar:rocket-linear",
    },
];

export default function HowItWorksSection() {
    return (
        <section className="py-32 bg-slate-950 text-white relative overflow-hidden border-y border-slate-900">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C2410C 1px, transparent 1px)', backgroundSize: '2.5rem 2.5rem' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[25rem] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-primary text-sm font-medium tracking-[0.2em] uppercase mb-6 flex items-center gap-4"
                        >
                            <span className="w-12 h-px bg-primary"></span> How We Build
                        </motion.div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-6xl font-medium font-heading tracking-tighter"
                        >
                            The Unipath <span className="text-primary">Methodology.</span>
                        </motion.h2>
                    </div>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="hidden md:flex text-xs text-slate-500 items-center gap-3 tracking-[0.2em] uppercase font-medium"
                    >
                        Step-by-step growth <IconifyIcon icon="solar:arrow-right-linear" className="text-primary animate-pulse" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {steps.map((step, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i }}
                            className="group relative flex flex-col bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full"
                        >
                            <div className="absolute -right-4 -bottom-4 text-8xl font-bold text-slate-800 opacity-20 group-hover:text-primary group-hover:opacity-10 transition-all duration-700 pointer-events-none font-heading">
                                {step.number}
                            </div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="text-primary font-medium text-xs mb-6 flex items-center gap-2 tracking-widest uppercase">
                                    <span className="w-6 h-px bg-primary"></span> Step {step.number}
                                </div>
                                
                                <h3 className="text-xl font-semibold text-white mb-4 tracking-tight font-heading group-hover:text-primary transition-colors">
                                    {step.title}
                                </h3>
                                
                                <p className="text-slate-400 text-sm font-light leading-relaxed mb-8 flex-grow">
                                    {step.description}
                                </p>
                                
                                <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                                    <IconifyIcon icon={step.icon} className="text-xl text-slate-400 group-hover:text-white" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
