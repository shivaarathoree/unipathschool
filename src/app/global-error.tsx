"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error (in production, send to Sentry/Datadog/etc.)
        console.error("[GlobalError]", error);
    }, [error]);

    return (
        <html>
            <body>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                        fontFamily: "system-ui, sans-serif",
                        backgroundColor: "#FAFAFA",
                        padding: "2rem",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            background: "#C2410C",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 24,
                            fontSize: 32,
                            color: "white",
                        }}
                    >
                        !
                    </div>
                    <h2
                        style={{
                            fontSize: 28,
                            fontWeight: 600,
                            color: "#0F172A",
                            marginBottom: 8,
                        }}
                    >
                        Something went wrong
                    </h2>
                    <p
                        style={{
                            fontSize: 14,
                            color: "#64748B",
                            maxWidth: 400,
                            lineHeight: 1.6,
                            marginBottom: 24,
                        }}
                    >
                        An unexpected error occurred. Our team has been notified.
                        Please try again or refresh the page.
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            background: "#C2410C",
                            color: "white",
                            border: "none",
                            padding: "12px 32px",
                            borderRadius: 9999,
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase" as const,
                            cursor: "pointer",
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
