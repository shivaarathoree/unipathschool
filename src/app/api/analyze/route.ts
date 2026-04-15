import { NextResponse } from "next/server";
import { fetchLeetCodeProfile } from "@/lib/leetcode/fetcher";
import { parseProfile } from "@/lib/leetcode/parser";
import type { AnalyzeResponse } from "@/lib/types";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const username = body.username;

        if (!username || typeof username !== "string") {
            return NextResponse.json(
                { success: false, error: "Username is required", errorCode: "INVALID_USERNAME" },
                { status: 400 }
            );
        }

        // 1. Fetch raw leetcode data
        const { profile: rawProfile, source } = await fetchLeetCodeProfile(username);

        // 2. Parse and analyze it
        const analyzedProfile = parseProfile(rawProfile, source);

        const response: AnalyzeResponse = {
            success: true,
            data: analyzedProfile,
        };

        return NextResponse.json(response);

    } catch (error: any) {
        console.error("[POST /api/analyze] Error:", error.message);
        let errorCode = "FETCH_FAILED";
        let status = 500;

        if (error.message === "USER_NOT_FOUND" || error.message === "INVALID_USERNAME") {
            errorCode = error.message;
            status = 404;
        }

        const response: AnalyzeResponse = {
            success: false,
            error: error.message || "Failed to analyze profile",
            errorCode: errorCode as any,
        };

        return NextResponse.json(response, { status });
    }
}
