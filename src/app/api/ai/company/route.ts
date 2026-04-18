import { NextResponse } from "next/server";
import { getCompanyInsight } from "@/lib/ai/aiEngine";
import type { AICompanyRequest } from "@/lib/types";

export async function POST(request: Request) {
    try {
        const body: AICompanyRequest = await request.json();
        const { profile, company } = body;

        if (!profile || !company) {
            return NextResponse.json({ success: false, error: "Profile and company are required" }, { status: 400 });
        }

        const insight = await getCompanyInsight(profile, company);

        return NextResponse.json({
            success: true,
            data: insight
        });

    } catch (error: any) {
        console.error("[POST /api/ai/company] Error:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
