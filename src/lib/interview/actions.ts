"use server";

import { generateObject } from "ai";
import { createGroq } from "@ai-sdk/groq";
import prisma from "@/lib/prisma";
import { feedbackSchema } from "@/lib/interview/constants";
import { getRandomInterviewCover } from "@/lib/interview/utils";
import type { CreateInterviewFeedbackParams, GetFeedbackByInterviewIdParams, GetLatestInterviewsParams, InterviewFeedback, InterviewRecord } from "@/lib/interview/types";

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
});

// ─── FEEDBACK GENERATION ─────────────────────────────────────

export async function createInterviewFeedback(params: CreateInterviewFeedbackParams) {
    const { interviewId, userId, transcript, feedbackId } = params;

    try {
        const formattedTranscript = transcript
            .map(
                (sentence: { role: string; content: string }) =>
                    `- ${sentence.role}: ${sentence.content}\n`
            )
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

        // Use Prisma to insert/update feedback
        let feedbackRecord;

        const data = {
            interviewId: interviewId,
            userId: userId,
            totalScore: object.totalScore,
            categoryScores: typeof object.categoryScores === 'object' ? object.categoryScores : JSON.parse(JSON.stringify(object.categoryScores)),
            strengths: object.strengths,
            areasForImprovement: object.areasForImprovement,
            finalAssessment: object.finalAssessment,
        };

        if (feedbackId) {
            feedbackRecord = await prisma.interviewFeedback.update({
                where: { id: feedbackId },
                data: data
            });
        } else {
            feedbackRecord = await prisma.interviewFeedback.create({
                data: data
            });
        }

        return { success: true, feedbackId: feedbackRecord.id };
    } catch (error: any) {
        console.error("Error saving feedback:", error);
        return { success: false, error: error.message || String(error) };
    }
}

// ─── INTERVIEW CRUD ──────────────────────────────────────────

export async function getInterviewById(id: string): Promise<InterviewRecord | null> {
    const interview = await prisma.interview.findUnique({
        where: { id }
    });
    if (!interview) return null;
    return { ...interview, createdAt: interview.createdAt.toISOString() } as unknown as InterviewRecord;
}

export async function getFeedbackByInterviewId(
    params: GetFeedbackByInterviewIdParams
): Promise<InterviewFeedback | null> {
    const { interviewId, userId } = params;

    const feedbackDoc = await prisma.interviewFeedback.findFirst({
        where: {
            interviewId: interviewId,
            userId: userId
        }
    });

    if (!feedbackDoc) return null;

    return { ...feedbackDoc, createdAt: feedbackDoc.createdAt.toISOString() } as unknown as InterviewFeedback;
}

export async function getLatestInterviews(
    params: GetLatestInterviewsParams
): Promise<InterviewRecord[]> {
    const { userId, limit = 20 } = params;

    const interviews = await prisma.interview.findMany({
        where: {
            finalized: true,
            userId: { not: userId }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
    });

    return interviews.map((doc) => ({
        ...doc,
        createdAt: doc.createdAt.toISOString()
    })) as unknown as InterviewRecord[];
}

export async function getInterviewsByUserId(
    userId: string
): Promise<InterviewRecord[]> {
    if (!userId) return [];

    const interviews = await prisma.interview.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' }
    });

    return interviews.map((doc) => ({
        ...doc,
        createdAt: doc.createdAt.toISOString()
    })) as unknown as InterviewRecord[];
}
