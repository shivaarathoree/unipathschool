"use client";

import Link from "next/link";
import IconifyIcon from "./IconifyIcon";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function Header() {
    const { user } = useAuth();
    return (
        <header className="fixed top-6 w-full z-50 px-6 flex justify-center pointer-events-none">
            <motion.div 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                className="max-w-6xl w-full glass rounded-full h-16 flex items-center justify-between px-2 pr-4 pointer-events-auto group/nav shadow-[0_0.5rem_2rem_rgba(15,23,42,0.05)] border border-white/50"
            >
                {/* Logo */}
                <div className="flex items-center pl-6 cursor-pointer group/logo relative">
                    <Link href="/" className="flex items-center gap-3 relative z-10">
                        <div className="flex items-center">
                            <span className="w-4 h-px bg-slate-900 mr-2 group-hover/logo:w-6 group-hover/logo:bg-primary transition-all duration-500 ease-out"></span>
                            <span className="font-heading font-semibold text-slate-900 group-hover/logo:text-primary transition-colors text-xl tracking-tighter">
                                UNIPATH
                            </span>
                            <span className="font-heading font-light text-slate-500 ml-1 text-xl tracking-tighter">
                                SCHOOL
                            </span>
                            <span className="w-1.5 h-4 bg-primary ml-1.5 opacity-80 animate-pulse group-hover/logo:opacity-100 group-hover/logo:shadow-[0_0_10px_#C2410C] transition-all"></span>
                        </div>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8 bg-slate-50/50 px-8 py-2.5 rounded-full border border-slate-200/50 group-hover/nav:border-slate-300/50 transition-colors">
                    <Link href="/#platform" className="relative text-[10px] font-medium text-slate-500 hover:text-primary uppercase tracking-[0.2em] transition-colors group/link">
                        Platform
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover/link:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                    <Link href="/#schools" className="relative text-[10px] font-medium text-slate-500 hover:text-primary uppercase tracking-[0.2em] transition-colors group/link">
                        Schools
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover/link:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                    <Link href="/#pricing" className="relative text-[10px] font-medium text-slate-500 hover:text-primary uppercase tracking-[0.2em] transition-colors group/link">
                        Pricing
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover/link:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <Link
                            href="/dashboard"
                            className="relative flex items-center justify-center px-6 py-2.5 text-xs font-medium text-white bg-slate-900 rounded-full overflow-hidden group/btn shadow-sm hover:shadow-lg transition-all duration-500"
                        >
                            <div className="absolute inset-0 w-0 bg-primary transition-all duration-500 ease-out group-hover/btn:w-full z-0"></div>
                            <span className="relative z-10 flex items-center gap-2 tracking-wider uppercase">
                                Dashboard 
                                <IconifyIcon icon="solar:arrow-right-linear" className="text-sm transform group-hover/btn:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden md:block text-[10px] font-medium text-slate-500 hover:text-slate-900 uppercase tracking-[0.2em] px-4 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/login?redirect=career-discovery"
                                className="relative flex items-center justify-center px-6 py-2.5 text-xs font-medium text-white bg-slate-900 rounded-full overflow-hidden group/btn shadow-sm hover:shadow-lg transition-all duration-500"
                            >
                                <div className="absolute inset-0 w-0 bg-primary transition-all duration-500 ease-out group-hover/btn:w-full z-0"></div>
                                <span className="relative z-10 flex items-center gap-2 tracking-wider uppercase">
                                    Start Path 
                                    <IconifyIcon icon="solar:arrow-right-linear" className="text-sm transform group-hover/btn:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </>
                    )}
                </div>
            </motion.div>
        </header>
    );
}
