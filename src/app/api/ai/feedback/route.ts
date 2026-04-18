import { NextResponse } from "next/server";
import { getInterviewFeedback } from "@/lib/ai/aiEngine";
import type { AIFeedbackRequest } from "@/lib/types";

export async function POST(request: Request) {
    try {
        const body: AIFeedbackRequest = await request.json();
        const { profile, question, answer, questionCategory } = body;

        if (!profile || !question || !answer || !questionCategory) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const feedback = await getInterviewFeedback(profile, question, answer, questionCategory);

        return NextResponse.json({
            success: true,
            data: feedback
        });

    } catch (error: any) {
        console.error("[POST /api/ai/feedback] Error:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
