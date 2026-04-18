"use client";

import { useEffect } from "react";

interface IconifyIconProps {
    icon: string;
    className?: string;
}

// Load Iconify script once
let scriptLoaded = false;

export default function IconifyIcon({ icon, className = "" }: IconifyIconProps) {
    useEffect(() => {
        if (scriptLoaded) return;
        if (typeof window !== "undefined" && !document.querySelector('script[src*="iconify"]')) {
            const script = document.createElement("script");
            script.src = "https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js";
            script.async = true;
            document.head.appendChild(script);
        }
        scriptLoaded = true;
    }, []);

    return (
        // @ts-expect-error web component
        <iconify-icon icon={icon} class={className} />
    );
}
