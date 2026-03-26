"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { adminDb } from "@/lib/firebase-admin";
import { feedbackSchema } from "@/lib/interview/constants";
import { getRandomInterviewCover } from "@/lib/interview/utils";
import type { CreateInterviewFeedbackParams, GetFeedbackByInterviewIdParams, GetLatestInterviewsParams, InterviewFeedback, InterviewRecord } from "@/lib/interview/types";

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
            model: google("gemini-2.0-flash-001", {
                structuredOutputs: false,
            }),
            schema: feedbackSchema,
            prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
            system:
                "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
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

        let feedbackRef;

        if (feedbackId) {
            feedbackRef = adminDb.collection("feedback").doc(feedbackId);
        } else {
            feedbackRef = adminDb.collection("feedback").doc();
        }

        await feedbackRef.set(feedback);

        return { success: true, feedbackId: feedbackRef.id };
    } catch (error) {
        console.error("Error saving feedback:", error);
        return { success: false };
    }
}

// ─── INTERVIEW CRUD ──────────────────────────────────────────

export async function getInterviewById(id: string): Promise<InterviewRecord | null> {
    const interview = await adminDb.collection("interviews").doc(id).get();
    if (!interview.exists) return null;
    return { id: interview.id, ...interview.data() } as InterviewRecord;
}

export async function getFeedbackByInterviewId(
    params: GetFeedbackByInterviewIdParams
): Promise<InterviewFeedback | null> {
    const { interviewId, userId } = params;

    const querySnapshot = await adminDb
        .collection("feedback")
        .where("interviewId", "==", interviewId)
        .where("userId", "==", userId)
        .limit(1)
        .get();

    if (querySnapshot.empty) return null;

    const feedbackDoc = querySnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as InterviewFeedback;
}

export async function getLatestInterviews(
    params: GetLatestInterviewsParams
): Promise<InterviewRecord[]> {
    const { userId, limit = 20 } = params;

    const interviews = await adminDb
        .collection("interviews")
        .orderBy("createdAt", "desc")
        .where("finalized", "==", true)
        .where("userId", "!=", userId)
        .limit(limit)
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as InterviewRecord[];
}

export async function getInterviewsByUserId(
    userId: string
): Promise<InterviewRecord[]> {
    if (!userId) return [];

    const interviews = await adminDb
        .collection("interviews")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as InterviewRecord[];
}
