// ============================================
// AI Interview Types
// ============================================

interface InterviewFeedback {
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

interface InterviewRecord {
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

interface CreateInterviewFeedbackParams {
    interviewId: string;
    userId: string;
    transcript: { role: string; content: string }[];
    feedbackId?: string;
}

interface GetFeedbackByInterviewIdParams {
    interviewId: string;
    userId: string;
}

interface GetLatestInterviewsParams {
    userId: string;
    limit?: number;
}

interface InterviewAgentProps {
    userName: string;
    userId?: string;
    interviewId?: string;
    feedbackId?: string;
    type: "generate" | "interview";
    questions?: string[];
}

interface InterviewCardDisplayProps {
    interviewId?: string;
    userId?: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt?: string;
}

interface TechIconDisplayProps {
    techStack: string[];
}

// VAPI Message types
enum MessageTypeEnum {
    TRANSCRIPT = "transcript",
    FUNCTION_CALL = "function-call",
    FUNCTION_CALL_RESULT = "function-call-result",
    ADD_MESSAGE = "add-message",
}

enum MessageRoleEnum {
    USER = "user",
    SYSTEM = "system",
    ASSISTANT = "assistant",
}

enum TranscriptMessageTypeEnum {
    PARTIAL = "partial",
    FINAL = "final",
}

interface BaseMessage {
    type: MessageTypeEnum;
}

interface TranscriptMessage extends BaseMessage {
    type: MessageTypeEnum.TRANSCRIPT;
    role: MessageRoleEnum;
    transcriptType: TranscriptMessageTypeEnum;
    transcript: string;
}

interface FunctionCallMessage extends BaseMessage {
    type: MessageTypeEnum.FUNCTION_CALL;
    functionCall: {
        name: string;
        parameters: unknown;
    };
}

interface FunctionCallResultMessage extends BaseMessage {
    type: MessageTypeEnum.FUNCTION_CALL_RESULT;
    functionCallResult: {
        forwardToClientEnabled?: boolean;
        result: unknown;
        [a: string]: unknown;
    };
}

type VapiMessage =
    | TranscriptMessage
    | FunctionCallMessage
    | FunctionCallResultMessage;
