"use server";

import prisma from "@/lib/prisma";
import { companyRequestSchema } from "@/lib/validations";

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 200;

export async function submitCompanyRequest(companyName: string, email: string) {
    // 1. Validate with Zod
    const parsed = companyRequestSchema.safeParse({ companyName, email });

    if (!parsed.success) {
        const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
        return { success: false, error: firstError };
    }

    const { companyName: cleanName, email: cleanEmail } = parsed.data;

    // 2. Write to DB with exponential backoff retry
    let lastError: string = "";

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            await prisma.companyRequest.create({
                data: {
                    companyName: cleanName,
                    email: cleanEmail || null,
                    status: "pending",
                    source: "server-action",
                },
            });

            return { success: true };
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Unknown database error";
            lastError = msg;

            // Don't retry on validation / unique constraint errors
            if (msg.includes("Unique constraint")) {
                return { success: false, error: "This request already exists." };
            }

            // Exponential backoff: 200ms, 400ms, 800ms
            if (attempt < MAX_RETRIES - 1) {
                await new Promise((r) => setTimeout(r, RETRY_BASE_MS * Math.pow(2, attempt)));
            }
        }
    }

    return {
        success: false,
        error: `Database is temporarily unreachable. Please try again in a moment.`,
    };
}
