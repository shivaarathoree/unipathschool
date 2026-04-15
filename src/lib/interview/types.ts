// ============================================
// AI Interview Types
// ============================================

export interface InterviewFeedback {
    id: string;
    interviewId: string;
    totalScore: number;
    categoryScores: Array<{
        name: string;
        score: number;
        comment: string;
    }>;
    strengths: string[];
    areasForImprovement: string[];
    finalAssessment: string;
    createdAt: string;
}

export interface InterviewRecord {
    id: string;
    role: string;
    level: string;
    questions: string[];
    techstack: string[];
    createdAt: string;
    userId: string;
    type: string;
    finalized: boolean;
    coverImage?: string;
}

export interface CreateInterviewFeedbackParams {
    interviewId: string;
    userId: string;
    transcript: { role: string; content: string }[];
    feedbackId?: string;
}

export interface GetFeedbackByInterviewIdParams {
    interviewId: string;
    userId: string;
}

export interface GetLatestInterviewsParams {
    userId: string;
    limit?: number;
}

export interface InterviewAgentProps {
    userName: string;
    userId?: string;
    interviewId?: string;
    feedbackId?: string;
    type: "generate" | "interview";
    questions?: string[];
}

export interface InterviewCardDisplayProps {
    interviewId?: string;
    userId?: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt?: string;
}

export interface TechIconDisplayProps {
    techStack: string[];
}

// VAPI Message types
export enum MessageTypeEnum {
    TRANSCRIPT = "transcript",
    FUNCTION_CALL = "function-call",
    FUNCTION_CALL_RESULT = "function-call-result",
    ADD_MESSAGE = "add-message",
}

export enum MessageRoleEnum {
    USER = "user",
    SYSTEM = "system",
    ASSISTANT = "assistant",
}

export enum TranscriptMessageTypeEnum {
    PARTIAL = "partial",
    FINAL = "final",
}

export interface BaseMessage {
    type: MessageTypeEnum;
}

export interface TranscriptMessage extends BaseMessage {
    type: MessageTypeEnum.TRANSCRIPT;
    role: MessageRoleEnum;
    transcriptType: TranscriptMessageTypeEnum;
    transcript: string;
}

export interface FunctionCallMessage extends BaseMessage {
    type: MessageTypeEnum.FUNCTION_CALL;
    functionCall: {
        name: string;
        parameters: unknown;
    };
}

export interface FunctionCallResultMessage extends BaseMessage {
    type: MessageTypeEnum.FUNCTION_CALL_RESULT;
    functionCallResult: {
        forwardToClientEnabled?: boolean;
        result: unknown;
        [a: string]: unknown;
    };
}

export type VapiMessage =
    | TranscriptMessage
    | FunctionCallMessage
    | FunctionCallResultMessage;
