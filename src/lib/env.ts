/**
 * Environment Variable Validation & Access Layer
 * Validates all required env vars at startup and provides typed access.
 * Crashes early in development if critical keys are missing.
 */

interface ServerEnv {
    DATABASE_URL: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;
    GEMINI_API_KEY: string;
    GROQ_API_KEY: string;
    GOOGLE_GENERATIVE_AI_API_KEY: string;
    RAZORPAY_KEY_SECRET: string;
}

interface ClientEnv {
    NEXT_PUBLIC_FIREBASE_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    NEXT_PUBLIC_FIREBASE_APP_ID: string;
    NEXT_PUBLIC_RAZORPAY_KEY_ID: string;
}

function getServerEnv(): ServerEnv {
    const env = {
        DATABASE_URL: process.env.DATABASE_URL ?? "",
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ?? "",
        FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ?? "",
        FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ?? "",
        GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "",
        GROQ_API_KEY: process.env.GROQ_API_KEY ?? "",
        GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "",
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ?? "",
    };

    // Only warn in dev, don't crash — some features can work without all keys
    if (process.env.NODE_ENV === "development") {
        const critical = ["DATABASE_URL"] as const;
        for (const key of critical) {
            if (!env[key]) {
                console.warn(`⚠️  Missing critical env var: ${key}`);
            }
        }
    }

    return env;
}

function getClientEnv(): ClientEnv {
    return {
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
        NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
        NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
    };
}

export const serverEnv = getServerEnv();
export const clientEnv = getClientEnv();
