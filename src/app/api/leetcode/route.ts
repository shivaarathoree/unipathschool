import { NextResponse } from "next/server";
import { fetchLeetCodeProfile } from "@/lib/leetcode/fetcher";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const { profile, source } = await fetchLeetCodeProfile(username);

        return NextResponse.json({
            success: true,
            data: profile,
            source
        });

    } catch (error: any) {
        console.error("[GET /api/leetcode] Error:", error.message);
        const status = (error.message === "USER_NOT_FOUND" || error.message === "INVALID_USERNAME") ? 404 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}
