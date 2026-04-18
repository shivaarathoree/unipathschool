"use client";

import IconifyIcon from "./IconifyIcon";
import { motion } from "framer-motion";

const marqueeItems = [
    { icon: "solar:route-linear", label: "50+ Career Paths" },
    { icon: "solar:dialog-linear", label: "10,000+ Interview Qs" },
    { icon: "solar:cpu-linear", label: "24/7 AI Guidance" },
    { icon: "solar:users-group-two-rounded-linear", label: "Real Job Prep" },
];

function MarqueeSet() {
    return (
        <div className="flex gap-12 items-center px-6">
            {marqueeItems.map((item, i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-500 whitespace-nowrap group cursor-default"
                >
                    <IconifyIcon icon={item.icon} className="text-xl text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-900 tracking-[0.2em] uppercase">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function MarqueeSection() {
    return (
        <div className="bg-white border-y border-slate-100 py-10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex-shrink-0"
                    >
                        <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">
                            Platform Scale
                        </span>
                    </motion.div>

                    <div className="flex-grow relative overflow-hidden h-10 flex items-center">
                        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
                        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
                        
                        <motion.div 
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="flex"
                        >
                            <MarqueeSet />
                            <MarqueeSet />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
