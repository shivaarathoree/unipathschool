"use client";

import IconifyIcon from "./IconifyIcon";
import { motion } from "framer-motion";
import Link from "next/link";
import RazorpayButton from "./RazorpayButton";

const freePlanFeatures = ["Career Path Discovery", "Basic Career Roadmap", "ATS Resume Builder", "Limited AI Analysis"];
const proPlanFeatures = ["Unlimited AI Mock Interviews", "Skill Gap Detection Engine", "Personalized Skill Roadmaps", "Career Readiness Score", "Advanced Resume Optimization"];

export default function PricingSection() {
    return (
        <section id="pricing" className="py-20 md:py-32 bg-white relative overflow-hidden border-b border-slate-100">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-12 md:mb-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-primary text-sm font-medium tracking-[0.2em] uppercase mb-6 flex items-center justify-center gap-4">
                        <span className="w-12 h-px bg-primary"></span> Pricing
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-3xl md:text-4xl lg:text-6xl font-medium font-heading text-slate-900 mb-4 md:mb-6 tracking-tighter">
                        Simple <span className="text-primary">Infrastructure.</span>
                    </motion.h2>
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                        We believe in making career intelligence accessible. No hidden fees, just pure value for your professional future.
                    </motion.p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="group relative p-8 md:p-12 bg-slate-50 border border-slate-200 rounded-[2rem] md:rounded-[3rem] hover:border-primary/30 transition-all duration-500 flex flex-col">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-8 md:mb-10 text-slate-400 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                <IconifyIcon icon="solar:user-linear" className="text-2xl" />
                            </div>
                            <div className="mb-8 md:mb-10">
                                <h3 className="text-xl md:text-2xl font-semibold font-heading text-slate-900 mb-2 tracking-tight uppercase">Explorer</h3>
                                <p className="text-sm text-slate-500 mb-6 md:mb-8 font-light">Begin your journey with zero commitment.</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl md:text-5xl text-slate-900 font-semibold font-heading tracking-tighter">&#8377;0</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">/ forever</span>
                                </div>
                            </div>
                            <div className="flex-grow mb-8 md:mb-12">
                                <ul className="space-y-4 md:space-y-5">
                                    {freePlanFeatures.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 md:gap-4 text-sm text-slate-600 font-medium">
                                            <IconifyIcon icon="solar:check-circle-linear" className="text-primary/40 text-lg" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link href="/career-discovery" className="w-full py-3.5 md:py-4 px-8 rounded-full border border-slate-300 text-slate-900 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 text-center">Join for Free</Link>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="group relative p-8 md:p-12 bg-slate-900 border border-slate-800 rounded-[2rem] md:rounded-[3rem] hover:border-primary/50 transition-all duration-500 flex flex-col overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-700"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-8 md:mb-10">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/10">
                                    <IconifyIcon icon="solar:star-fall-bold-duotone" className="text-2xl" />
                                </div>
                                <span className="px-3 md:px-4 py-1.5 bg-primary/10 text-primary text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">Most Popular</span>
                            </div>
                            <div className="mb-8 md:mb-10">
                                <h3 className="text-xl md:text-2xl font-semibold font-heading text-white mb-2 tracking-tight uppercase">Pro Membership</h3>
                                <p className="text-sm text-slate-400 mb-6 md:mb-8 font-light">Full transparency. Future-proof your career.</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl md:text-5xl text-white font-semibold font-heading tracking-tighter">&#8377;499</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">/ month</span>
                                </div>
                            </div>
                            <div className="flex-grow mb-8 md:mb-12">
                                <ul className="space-y-4 md:space-y-5">
                                    {proPlanFeatures.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 md:gap-4 text-sm text-slate-300 font-medium">
                                            <IconifyIcon icon="solar:check-circle-linear" className="text-primary text-lg" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <RazorpayButton amount={499} title="Pro Membership" description="Unlimited AI Mock Interviews & Advanced Features" buttonText="Upgrade to Pro" className="relative w-full py-3.5 md:py-4 px-8 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary-dark transition-all duration-500 text-center shadow-lg shadow-primary/20 flex items-center justify-center gap-2" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
