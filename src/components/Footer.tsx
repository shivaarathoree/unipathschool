"use client";

import { motion } from "framer-motion";
import IconifyIcon from "./IconifyIcon";
import Link from "next/link";

const footerLinks = {
    Platform: [
        { label: "Discovery", href: "/career-discovery" },
        { label: "Pricing", href: "#pricing" },
        { label: "Schools", href: "#schools" },
    ],
    Company: [
        { label: "Resources", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Privacy", href: "#" },
    ],
    Connect: [
        { label: "LinkedIn", href: "#" },
        { label: "Twitter", href: "#" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-white pt-32 pb-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Brand Section */}
                <div className="mb-32 overflow-hidden relative flex justify-center perspective-[1000px]">
                    <motion.h2 
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
                        className="text-[13vw] md:text-[15vw] leading-[0.85] font-bold tracking-tighter text-primary uppercase font-heading select-none opacity-20 hover:opacity-100 transition-opacity duration-700"
                    >
                        UNIPATH
                    </motion.h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
                    <div className="col-span-2 md:col-span-1">
                        <h5 className="text-[10px] font-bold text-slate-500 mb-8 uppercase tracking-[0.2em]">Navigation</h5>
                        <ul className="flex flex-col gap-4">
                            {footerLinks.Platform.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm font-light text-slate-400 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-[10px] font-bold text-slate-500 mb-8 uppercase tracking-[0.2em]">Company</h5>
                        <ul className="flex flex-col gap-4">
                            {footerLinks.Company.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm font-light text-slate-400 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-[10px] font-bold text-slate-500 mb-8 uppercase tracking-[0.2em]">Socials</h5>
                        <ul className="flex flex-col gap-4">
                            {footerLinks.Connect.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm font-light text-slate-400 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-[10px] font-bold text-slate-500 mb-8 uppercase tracking-[0.2em]">Location</h5>
                        <p className="text-sm font-light text-slate-400 leading-relaxed max-w-xs">
                            Innovating Education for the <br />
                            AI-First Generation.<br />
                            Worldwide.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-t border-slate-900 pt-12">
                    <div className="w-full max-w-sm">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block mb-6">Stay Updated</label>
                        <form className="flex items-center border-b border-slate-800 pb-3 group focus-within:border-primary transition-colors">
                            <input type="email" placeholder="Enter your email" className="w-full bg-transparent text-sm text-white placeholder:text-slate-700 outline-none font-light" />
                            <button type="submit" className="text-slate-700 group-focus-within:text-primary transition-colors">
                                <IconifyIcon icon="solar:arrow-right-linear" className="text-xl" />
                            </button>
                        </form>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full lg:w-auto gap-8 flex-1 lg:justify-end">
                        <div className="text-xs font-light text-slate-600">
                            © 2026 UNIPATH SCHOOL. All rights reserved.
                        </div>
                        <button 
                            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
                            className="flex items-center gap-3 text-xs font-medium text-slate-400 hover:text-white transition-all group"
                        >
                            Back to top
                            <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center bg-slate-900 group-hover:border-primary transition-colors">
                                <IconifyIcon icon="solar:arrow-up-linear" className="text-lg" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
