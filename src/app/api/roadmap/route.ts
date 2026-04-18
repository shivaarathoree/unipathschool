import { NextResponse } from "next/server";
import { generateCareerRoadmap } from "@/actions/careerPath";

export async function POST(req: Request) {
    console.log("✅ API route /api/roadmap was hit");

    try {
        const body = await req.json();
        // Frontend sends { answers, uid }, user snippet expects { firebaseUid, ...answers }
        // We handle both gracefully to ensure it works smoothly!
        const answers = body.answers || body;
        const firebaseUid = body.uid || body.firebaseUid;

        console.log("📦 Received answers:", answers);
        console.log("👤 Firebase UID:", firebaseUid);

        // Validate authentication
        if (!firebaseUid) {
            return NextResponse.json(
                { success: false, error: "Authentication required to generate career roadmap" },
                { status: 401 }
            );
        }

        // Validate answers
        const requiredFields = [
            "careerField",
            "educationYear",
            "skillLevel",
            "timeCommitment",
            "careerGoal",
            "biggestChallenge"
        ];

        for (const field of requiredFields) {
            if (!answers[field]) {
                return NextResponse.json(
                    { success: false, error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        console.log("✅ All fields validated");

        // Generate roadmap with Firebase UID
        const result = await generateCareerRoadmap(answers, firebaseUid);

        console.log("✅ Roadmap generated successfully");

        return NextResponse.json({
            success: true,
            ...result,
            // Provide a mock remaining limit until DB integrates smoothly
            remainingGenerations: 2
        });

    } catch (err: any) {
        console.error("❌ Error in /api/roadmap:", err);

        // Handle rate limit errors
        if (err.message && err.message.includes('daily limit')) {
            return NextResponse.json(
                { success: false, error: err.message, remaining: 0, limit: 3 },
                { status: 429 }
            );
        }

        // Handle authentication errors
        if (err.message && err.message.includes('Authentication required')) {
            return NextResponse.json(
                { success: false, error: err.message },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: err.message || "Failed to generate career roadmap"
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Career Roadmap API is working! Use POST to generate a roadmap."
    });
}
