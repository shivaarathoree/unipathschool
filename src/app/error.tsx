"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[RouteError]", error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-6 text-3xl text-red-500">
                !
            </div>
            <h2 className="text-2xl font-heading font-medium text-slate-900 mb-2 tracking-tight">
                Something went wrong
            </h2>
            <p className="text-sm text-slate-500 font-light max-w-md mb-8 leading-relaxed">
                This page encountered an unexpected error. You can try again or go back to the homepage.
            </p>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => reset()}
                    className="bg-primary hover:bg-primary-dark text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3 rounded-full transition-all"
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors px-4 py-3"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
