import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { getRandomInterviewCover } from "@/lib/interview/utils";
import prisma from "@/lib/prisma";

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
    const body = await request.json();
    const { type, role, level, techstack, amount, userId } = body;

    if (!role || !userId) {
        return Response.json(
            { success: false, error: "Missing required fields: role and userId" },
            { status: 400 }
        );
    }

    // Add API limitation: Free tier users can only generate up to 5 interviews
    // (A real production app would check isPro here, but simple count works for protection)
    const existingInterviewsCount = await prisma.interview.count({
        where: { userId: userId }
    });

    if (existingInterviewsCount >= 5) {
        return Response.json(
            { success: false, error: "Quota Exceeded: You have reached the maximum of 5 free mock interviews. Please upgrade to Pro to unlock unlimited sessions." },
            { status: 403 }
        );
    }

    try {
        const { text: questions } = await generateText({
            model: groq("llama-3.3-70b-versatile"),
            prompt: `You are a senior technical recruiter at a FAANG-tier company (Google, Meta, Amazon, Apple, Netflix, Microsoft, Stripe, etc.). Your task is to prepare rigorous, production-grade interview questions.

CONTEXT:
- Target Role: ${role}
- Seniority Level: ${level || "Junior"}
- Technical Domain: ${techstack || "General Computer Science"}
- Interview Style: ${type || "Technical"} (weigh your questions accordingly)
- Required Questions: ${amount || 5}

INSTRUCTIONS:
- For Technical interviews: Ask deep systems design, algorithmic complexity, distributed systems, or domain-specific architecture questions. No toy problems. Think L5+ Google/Meta caliber.
- For Behavioral interviews: Use STAR-format probing questions that assess leadership, ambiguity tolerance, cross-functional influence, and conflict resolution at scale.
- For Mixed interviews: Blend both — open with a behavioral question, then escalate into technical depth.
- Each question should be self-contained, specific, and require 2-3 minutes to answer thoroughly.
- DO NOT use special characters like "/" or "*" — these will be read aloud by a voice assistant.
- Return ONLY a valid JSON array of strings. No markdown, no explanation, no preamble.

OUTPUT FORMAT (strict JSON array):
["Question 1", "Question 2", "Question 3"]
`,
        });

        // Parse questions - handle potential markdown formatting from AI
        let parsedQuestions: string[];
        try {
            const cleanedQuestions = questions
                .replace(/```json\s*/gi, "")
                .replace(/```\s*/g, "")
                .trim();
            parsedQuestions = JSON.parse(cleanedQuestions);
        } catch {
            console.warn("Failed to parse JSON, attempting line extraction:", questions);
            parsedQuestions = questions
                .split("\n")
                .map((line: string) => line.replace(/^[\d.\-\s*"]+/, "").replace(/[",\]]+$/, "").trim())
                .filter((line: string) => line.length > 15);

            if (parsedQuestions.length === 0) {
                throw new Error("Could not parse questions from AI response");
            }
        }

        // Handle techstack as either string or array
        const techstackArray = typeof techstack === "string"
            ? techstack.split(",").map((t: string) => t.trim()).filter(Boolean)
            : Array.isArray(techstack) ? techstack : ["General"];

        // Save the interview to Neon Database via Prisma
        const interview = await prisma.interview.create({
            data: {
                role: role,
                type: type || "Technical",
                level: level || "Junior",
                techstack: techstackArray,
                questions: parsedQuestions,
                userId: userId,
                finalized: true,
                coverImage: getRandomInterviewCover(),
            }
        });

        // Convert Dates to ISO strings for client parity
        const parsedInterview = {
            ...interview,
            createdAt: interview.createdAt.toISOString()
        };

        return Response.json({ success: true, interview: parsedInterview }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return Response.json({ success: false, error: errorMessage }, { status: 500 });
    }
}

export async function GET() {
    return Response.json({ success: true, data: "VAPI generate endpoint ready" }, { status: 200 });
}
