import { generateObject } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { feedbackSchema } from "@/lib/interview/constants";

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
    const body = await request.json();
    const { interviewId, userId, transcript } = body;

    if (!interviewId || !userId || !transcript) {
        return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    try {
        const formattedTranscript = transcript
            .map((sentence: { role: string; content: string }) => `- ${sentence.role}: ${sentence.content}\n`)
            .join("");

        const { object } = await generateObject({
            model: groq("llama-3.3-70b-versatile"),
            schema: feedbackSchema,
            prompt: `
You are a FAANG hiring committee member (Google HC, Meta E5+ bar raiser, or Amazon Bar Raiser) conducting a post-interview debrief. You are evaluating a candidate based on their mock interview transcript. You are known for your uncompromising standards and surgical precision in assessment.

EVALUATION PRINCIPLES:
- Apply the same bar as a Google L5 or Meta E5 hiring committee. A score of 70+ means "Strong Hire." Below 50 is "No Hire."
- Do NOT inflate scores. Most candidates should score between 40-70. A perfect 100 is virtually impossible.
- Be brutally specific in your feedback. Generic praise like "good communication" is unacceptable — cite exact moments from the transcript.
- Identify missed opportunities: what a top-1% candidate would have said differently.
- Strengths should highlight genuinely impressive moments only. If there are none, say so.
- Areas for improvement should be actionable, specific, and reference industry-standard frameworks (STAR, system design principles, Big-O analysis, etc.)

TRANSCRIPT:
${formattedTranscript}

Score the candidate from 0 to 100 in these categories (DO NOT add or rename categories):
- Communication Skills: Did they structure responses using frameworks? Were answers concise yet comprehensive? Did they avoid rambling?
- Technical Knowledge: Did they demonstrate depth beyond surface-level understanding? Did they reference trade-offs, edge cases, and production-scale considerations?
- Problem Solving: Did they decompose problems systematically? Did they consider multiple approaches before committing? Did they validate their solution?
- Cultural Fit: Did they demonstrate ownership, bias for action, and the ability to operate in ambiguity? Would you want them on your team?
- Confidence and Clarity: Did they project authority without arrogance? Did they handle uncertainty gracefully?
`,
            system:
                "You are an elite FAANG hiring committee member. Your evaluations are data-driven, citation-heavy, and hold candidates to the highest industry bar. You never give inflated scores. Your feedback reads like a Google HC packet review.",
        });

        const feedback = {
            interviewId,
            userId,
            totalScore: object.totalScore,
            categoryScores: object.categoryScores,
            strengths: object.strengths,
            areasForImprovement: object.areasForImprovement,
            finalAssessment: object.finalAssessment,
            createdAt: new Date().toISOString(),
        };

        // Return the feedback to the client for saving to Firestore
        return Response.json({ success: true, feedback }, { status: 200 });

    } catch (error) {
        console.error("Error generating feedback:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during feedback generation";
        return Response.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
