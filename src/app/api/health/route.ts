import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    const checks: Record<string, "ok" | "fail"> = {
        server: "ok",
        database: "fail",
        env: "fail",
    };

    // 1. Database connectivity
    try {
        await prisma.$queryRaw`SELECT 1`;
        checks.database = "ok";
    } catch {
        checks.database = "fail";
    }

    // 2. Critical env vars
    const requiredVars = ["DATABASE_URL", "NEXT_PUBLIC_FIREBASE_API_KEY"];
    const allPresent = requiredVars.every((v) => !!process.env[v]);
    checks.env = allPresent ? "ok" : "fail";

    const allHealthy = Object.values(checks).every((v) => v === "ok");

    return NextResponse.json(
        {
            status: allHealthy ? "healthy" : "degraded",
            timestamp: new Date().toISOString(),
            checks,
        },
        { status: allHealthy ? 200 : 503 }
    );
}
