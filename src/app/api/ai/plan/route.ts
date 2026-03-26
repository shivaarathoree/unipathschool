import { NextResponse } from "next/server";
import { generateStudyPlan } from "@/lib/ai/aiEngine";
import type { AIRequest } from "@/lib/types";

export async function POST(request: Request) {
    try {
        const body: AIRequest = await request.json();
        const { profile } = body;

        if (!profile) {
            return NextResponse.json({ success: false, error: "Profile is required" }, { status: 400 });
        }

        const plan = await generateStudyPlan(profile);

        return NextResponse.json({
            success: true,
            data: plan
        });

    } catch (error: any) {
        console.error("[POST /api/ai/plan] Error:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
