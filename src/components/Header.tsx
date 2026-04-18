"use client";

import Link from "next/link";
import IconifyIcon from "./IconifyIcon";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const navLinks = [
    { label: "Platform", href: "/#platform" },
    { label: "School",   href: "/#schools" },
    { label: "Pricing",  href: "/#pricing" },
    { label: "Team",     href: "/team" },
];

export default function Header() {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <header className="fixed top-6 w-full z-50 px-4 sm:px-6 flex justify-center pointer-events-none">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    className="max-w-6xl w-full glass rounded-full h-14 sm:h-16 flex items-center justify-between px-2 pr-3 sm:pr-4 pointer-events-auto group/nav shadow-[0_0.5rem_2rem_rgba(15,23,42,0.05)] border border-white/50"
                >
                    {/* Logo */}
                    <div className="flex items-center pl-4 sm:pl-6 cursor-pointer group/logo relative shrink-0">
                        <Link href="/" className="flex items-center gap-3 relative z-10">
                            <div className="flex items-center">
                                <span className="w-4 h-px bg-slate-900 mr-2 group-hover/logo:w-6 group-hover/logo:bg-primary transition-all duration-500 ease-out"></span>
                                <span className="font-heading font-semibold text-slate-900 group-hover/logo:text-primary transition-colors text-lg sm:text-xl tracking-tighter">
                                    UNIPATH
                                </span>
                                <span className="font-heading font-light text-slate-500 ml-1 text-lg sm:text-xl tracking-tighter hidden sm:inline">
                                    SCHOOL
                                </span>
                                <span className="w-1.5 h-4 bg-primary ml-1.5 opacity-80 animate-pulse group-hover/logo:opacity-100 group-hover/logo:shadow-[0_0_10px_#C2410C] transition-all"></span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8 bg-slate-50/50 px-8 py-2.5 rounded-full border border-slate-200/50 group-hover/nav:border-slate-300/50 transition-colors">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="relative text-[10px] font-medium text-slate-500 hover:text-primary uppercase tracking-[0.2em] transition-colors group/link"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover/link:w-full transition-all duration-300 ease-out"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="hidden sm:flex relative items-center justify-center px-5 sm:px-6 py-2.5 text-xs font-medium text-white bg-slate-900 rounded-full overflow-hidden group/btn shadow-sm hover:shadow-lg transition-all duration-500"
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
                                    className="hidden sm:flex relative items-center justify-center px-5 sm:px-6 py-2.5 text-xs font-medium text-white bg-slate-900 rounded-full overflow-hidden group/btn shadow-sm hover:shadow-lg transition-all duration-500"
                                >
                                    <div className="absolute inset-0 w-0 bg-primary transition-all duration-500 ease-out group-hover/btn:w-full z-0"></div>
                                    <span className="relative z-10 flex items-center gap-2 tracking-wider uppercase">
                                        Start Path
                                        <IconifyIcon icon="solar:arrow-right-linear" className="text-sm transform group-hover/btn:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                            </>
                        )}

                        {/* Mobile Hamburger */}
                        <button
                            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 text-slate-600 hover:border-primary/30 hover:text-primary transition-all duration-300"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label="Toggle menu"
                        >
                            <IconifyIcon icon={menuOpen ? "solar:close-linear" : "solar:hamburger-menu-linear"} className="text-xl" />
                        </button>
                    </div>
                </motion.div>
            </header>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="fixed top-[5rem] left-4 right-4 sm:left-6 sm:right-6 z-40 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-2xl shadow-slate-900/10 overflow-hidden pointer-events-auto md:hidden"
                    >
                        <nav className="flex flex-col p-4 gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-medium text-slate-700 hover:text-primary hover:bg-slate-50 transition-all duration-200 group"
                                >
                                    <span className="uppercase tracking-[0.15em] text-[11px] font-semibold">{link.label}</span>
                                    <IconifyIcon icon="solar:arrow-right-linear" className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all text-base" />
                                </Link>
                            ))}
                            <div className="h-px bg-slate-100 my-2 mx-2" />
                            {user ? (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 mx-2 py-4 rounded-2xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all duration-500"
                                >
                                    Dashboard <IconifyIcon icon="solar:arrow-right-linear" />
                                </Link>
                            ) : (
                                <Link
                                    href="/login?redirect=career-discovery"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 mx-2 py-4 rounded-2xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all duration-500"
                                >
                                    Start Path <IconifyIcon icon="solar:rocket-linear" />
                                </Link>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
