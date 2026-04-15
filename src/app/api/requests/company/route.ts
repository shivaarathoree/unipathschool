import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

// Simple in-memory rate limiting to prevent spam
// In a distributed environment (serverless fleet with many instances),
// this works per instance. For a 10k-20k scale architecture with a real load balancer,
// this rate limiting state would ideally be backed by Redis / Vercel KV.
const rateLimit = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

export async function POST(request: Request) {
    try {
        // Implement Basic Rate Limiting
        const forwardedFor = request.headers.get("x-forwarded-for");
        const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";
        const now = Date.now();

        if (ip !== "unknown") {
            const userRate = rateLimit.get(ip);
            if (userRate) {
                if (now - userRate.timestamp < RATE_LIMIT_WINDOW_MS) {
                    if (userRate.count >= MAX_REQUESTS_PER_WINDOW) {
                        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
                    }
                    userRate.count += 1;
                } else {
                    rateLimit.set(ip, { count: 1, timestamp: now });
                }
            } else {
                rateLimit.set(ip, { count: 1, timestamp: now });
            }
        }

        const body = await request.json();
        const { companyName, email } = body;

        if (!companyName || typeof companyName !== "string" || companyName.trim().length === 0) {
            return NextResponse.json({ error: "Company name is required" }, { status: 400 });
        }

        // Add to firestore
        const docRef = adminDb.collection("companyRequests").doc();
        await docRef.set({
            companyName: companyName.trim(),
            email: email?.trim() || "",
            createdAt: new Date().toISOString(),
            status: "pending",
            ip: ip !== "unknown" ? ip : null
        });

        return NextResponse.json({ success: true, message: "Request received successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error submitting company request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
