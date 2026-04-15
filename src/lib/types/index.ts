// ============================================================
// UNIPATH SCHOOL — FAANG Readiness Engine
// Core TypeScript Types & Interfaces
// ============================================================

export type Difficulty = "Easy" | "Medium" | "Hard";
export type TopicStatus = "strong" | "average" | "weak";
export type PhaseStatus = "complete" | "in-progress" | "locked";
export type Phase = "Foundation" | "Data Structures" | "Algorithms" | "Advanced";
export type AIProvider = "gemini" | "grok";

// ─── LeetCode Raw API Response ───────────────────────────────

export interface LeetCodeTagCount {
    tagName: string;
    tagSlug: string;
    problemsSolved: number;
}

export interface LeetCodeRawProfile {
    username: string;
    realName: string;
    ranking: number;
    reputation: number;
    starRating: number;
    aboutMe: string;
    avatar: string;
    totalSolved: number;
    totalQuestions: number;
    easySolved: number;
    totalEasy: number;
    mediumSolved: number;
    totalMedium: number;
    hardSolved: number;
    totalHard: number;
    acceptanceRate: number;
    contributionPoints: number;
    streak: number;
    totalActiveDays: number;
    submissionCalendar: Record<string, number>; // unix_timestamp → count
    tagProblemCounts: {
        advanced: LeetCodeTagCount[];
        intermediate: LeetCodeTagCount[];
        fundamental: LeetCodeTagCount[];
    };
    recentSubmissions: RecentSubmission[];
    badges: Badge[];
}

export interface RecentSubmission {
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
}

export interface Badge {
    id: string;
    displayName: string;
    icon: string;
    creationDate: string;
}

// ─── Processed Topic Data ────────────────────────────────────

export interface TopicStat {
    topic: string;
    tagSlug: string;
    solved: number;
    threshold: number;
    phase: Phase;
    status: TopicStatus;
    percentComplete: number;
    gapCount: number;           // threshold - solved (if negative, surplus)
    priorityScore: number;      // used for roadmap ordering
    relatedProblems: RecommendedProblem[];
}

// ─── Scoring ─────────────────────────────────────────────────

export interface ScoreBreakdown {
    total: number;              // 0–100
    topicCoverage: number;      // 0–100, weight 40%
    problemVolume: number;      // 0–100, weight 30%
    difficultyBalance: number;  // 0–100, weight 20%
    consistency: number;        // 0–100, weight 10%
    // Detailed sub-metrics
    strongTopicsCount: number;
    weakTopicsCount: number;
    averageTopicsCount: number;
    mediumRatio: number;
    hardRatio: number;
    submissionsLast30Days: number;
    longestStreak: number;
}

export interface ReadinessLevel {
    label: string;
    description: string;
    color: string;
    emoji: string;
    nextMilestone: string;
}

// ─── Skill Gap Engine ─────────────────────────────────────────

export interface SkillGap {
    topic: string;
    phase: Phase;
    currentSolved: number;
    targetThreshold: number;
    gapSize: number;
    urgency: "critical" | "high" | "medium" | "low";
    estimatedDaysToClose: number; // assumes 3 problems/day
    suggestedProblems: RecommendedProblem[];
}

export interface SkillGapReport {
    criticalGaps: SkillGap[];
    highGaps: SkillGap[];
    mediumGaps: SkillGap[];
    lowGaps: SkillGap[];
    totalGapProblems: number;
    estimatedDaysToFAANGReady: number;
    topPriorityTopic: string;
}

// ─── Roadmap ─────────────────────────────────────────────────

export interface RoadmapTopic {
    topic: string;
    tagSlug: string;
    solved: number;
    threshold: number;
    status: TopicStatus;
    weeklyTarget: number;
    mustSolveProblems: RecommendedProblem[];
}

export interface RoadmapPhase {
    phase: Phase;
    phaseNumber: 1 | 2 | 3 | 4;
    status: PhaseStatus;
    completionPercent: number;
    topics: RoadmapTopic[];
    problemTarget: number;
    problemsDone: number;
    estimatedWeeks: number;
    keyInsight: string;
}

export interface Roadmap {
    phases: RoadmapPhase[];
    totalEstimatedWeeks: number;
    currentFocus: Phase;
    weeklyProblemTarget: number;
    milestones: Milestone[];
}

export interface Milestone {
    title: string;
    targetScore: number;
    achieved: boolean;
    reward: string;
}

// ─── Recommended Problems ─────────────────────────────────────

export interface RecommendedProblem {
    id: number;
    title: string;
    titleSlug: string;
    difficulty: Difficulty;
    topic: string;
    acceptanceRate?: number;
    frequency?: number;         // how often in interviews (0–1)
    isTopInterview?: boolean;
    companies?: string[];
    leetcodeUrl: string;
}

// ─── Company Tracks ───────────────────────────────────────────

export type CompanyName = "Google" | "Amazon" | "Meta" | "Apple" | "Microsoft" | "Netflix";

export interface CompanyTrack {
    company: CompanyName;
    color: string;
    logo: string;
    focusTopics: string[];
    topicWeights: Record<string, number>; // topic → importance 0-1
    readinessScore: number;               // computed per-user
    topGapTopics: string[];
    mustSolveProblems: RecommendedProblem[];
    interviewStyle: string;
    roundsCount: number;
    dsaWeight: number;                    // % of interview is DSA
    systemDesignWeight: number;
    behavioralWeight: number;
    keyTip: string;
}

// ─── AI Analysis ─────────────────────────────────────────────

export interface AIStudyPlan {
    provider: AIProvider;
    generatedAt: string;
    weeks: StudyWeek[];
    totalProblems: number;
    focusMessage: string;
    warningMessage?: string;
}

export interface StudyWeek {
    weekNumber: number;
    theme: string;
    topics: string[];
    dailyProblems: DailyProblem[];
    weeklyGoal: string;
    checkpointTest: string;
}

export interface DailyProblem {
    day: number;
    problem: RecommendedProblem;
    whyThisProblem: string;
}

export interface AIInterviewFeedback {
    provider: AIProvider;
    score: number;           // 1–10
    verdict: "Hire" | "Strong Hire" | "No Hire" | "Borderline";
    strengths: string[];
    improvements: string[];
    modelAnswer: string;
    timeComplexity?: string;
    spaceComplexity?: string;
    followUpQuestion: string;
}

export interface AICompanyInsight {
    provider: AIProvider;
    company: CompanyName;
    readinessAssessment: string;
    gapAnalysis: string;
    actionPlan: string[];
    estimatedPrepWeeks: number;
    confidenceLevel: "Low" | "Medium" | "High";
}

// ─── Full Profile ─────────────────────────────────────────────

export interface FANGProfile {
    // Meta
    fetchedAt: string;
    cacheHit: boolean;
    dataSource: "leetcode-graphql" | "alfa-api" | "fallback";

    // User
    username: string;
    realName: string;
    avatar: string;
    ranking: number;
    streak: number;
    totalActiveDays: number;
    badges: Badge[];
    recentSubmissions: RecentSubmission[];

    // Stats
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    acceptanceRate: number;
    submissionsLast30Days: number;
    submissionsLast7Days: number;

    // Engine Outputs
    topics: TopicStat[];
    score: ScoreBreakdown;
    readinessLevel: ReadinessLevel;
    skillGapReport: SkillGapReport;
    roadmap: Roadmap;
    companyTracks: CompanyTrack[];
    topRecommendedProblems: RecommendedProblem[];

    // Heatmap data
    submissionCalendar: Record<string, number>;
}

// ─── API Request/Response ─────────────────────────────────────

export interface AnalyzeRequest {
    username: string;
    forceRefresh?: boolean;
}

export interface AnalyzeResponse {
    success: boolean;
    data?: FANGProfile;
    error?: string;
    errorCode?: "USER_NOT_FOUND" | "RATE_LIMITED" | "PRIVATE_PROFILE" | "FETCH_FAILED";
}

export interface AIRequest {
    username: string;
    profile: FANGProfile;
    provider?: AIProvider;
    extraContext?: string;
}

export interface AIFeedbackRequest extends AIRequest {
    question: string;
    answer: string;
    questionCategory: string;
}

export interface AICompanyRequest extends AIRequest {
    company: CompanyName;
}

// ─── Frontend State ───────────────────────────────────────────

export type AppTab =
    | "overview"
    | "topics"
    | "roadmap"
    | "problems"
    | "interview"
    | "study-plan"
    | "company-tracks"
    | "heatmap";

export interface AppState {
    username: string;
    loading: boolean;
    error: string | null;
    profile: FANGProfile | null;
    activeTab: AppTab;
    aiProvider: AIProvider;
}
