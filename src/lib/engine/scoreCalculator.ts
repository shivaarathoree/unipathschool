// ============================================================
// UNIPATH SCHOOL — FAANG Readiness Engine
// lib/engine/scoreCalculator.ts
// Weighted scoring algorithm per PRD specification
// ============================================================

import type {
    LeetCodeRawProfile,
    TopicStat,
    ScoreBreakdown,
    ReadinessLevel,
} from "../types";

// ─── Weight Constants (from PRD) ─────────────────────────────
const WEIGHTS = {
    TOPIC_COVERAGE: 0.40,
    PROBLEM_VOLUME: 0.30,
    DIFFICULTY_BALANCE: 0.20,
    CONSISTENCY: 0.10,
};

// Volume benchmark: 300 total problems = 100% on volume score
const VOLUME_BENCHMARK = 300;

// Consistency benchmark: 60-day streak = max streak score
const STREAK_BENCHMARK = 60;
const ACTIVE_DAYS_BENCHMARK = 200;

// ─── Readiness Level Definitions ─────────────────────────────
const READINESS_LEVELS: ReadinessLevel[] = [
    {
        label: "Not Ready",
        description: "You're at the very beginning. Focus on arrays and strings first.",
        color: "#ef4444",
        emoji: "🔴",
        nextMilestone: "Solve 50 easy problems and learn arrays/strings",
    },
    {
        label: "Beginner",
        description: "Foundation topics need more work. Keep grinding the basics.",
        color: "#f97316",
        emoji: "🟠",
        nextMilestone: "Cover all Foundation topics and hit 100 total problems",
    },
    {
        label: "Developing",
        description: "Good progress on basics. Now push into data structures.",
        color: "#f59e0b",
        emoji: "🟡",
        nextMilestone: "Strengthen trees, linked lists, and binary search",
    },
    {
        label: "Intermediate",
        description: "Solid foundation. Algorithms (graphs, DP) need attention.",
        color: "#eab308",
        emoji: "🟡",
        nextMilestone: "Solve 15+ DP and 10+ graph problems",
    },
    {
        label: "Getting There",
        description: "Strong base and DS skills. Close the algorithm gaps now.",
        color: "#84cc16",
        emoji: "🟢",
        nextMilestone: "Tackle advanced topics and hit 200 total problems",
    },
    {
        label: "Competitive",
        description: "You can handle most FAANG rounds. Polish and consistency needed.",
        color: "#22c55e",
        emoji: "🟢",
        nextMilestone: "Solve 10+ hard problems and maintain a daily streak",
    },
    {
        label: "FAANG Ready",
        description: "Strong across all areas. Focus on mock interviews and revision.",
        color: "#00e5a0",
        emoji: "⚡",
        nextMilestone: "Mock interview daily and review weak edge cases",
    },
    {
        label: "Elite",
        description: "Top-tier preparation. You are ready for any FAANG interview.",
        color: "#06b6d4",
        emoji: "🏆",
        nextMilestone: "You're ready. Apply, practice mock interviews, stay sharp.",
    },
];

// ─── Metric Calculators ───────────────────────────────────────

/**
 * Topic Coverage Score (0–100)
 * Weighted by topic importance — strong on high-weight topics scores more.
 */
export function calcTopicCoverage(topics: TopicStat[]): number {
    if (topics.length === 0) return 0;

    let weightedScore = 0;
    let totalWeight = 0;

    for (const t of topics) {
        // Each topic contributes proportionally to how complete it is, scaled by its weight
        const completion = Math.min(1, t.solved / t.threshold);
        weightedScore += completion * ((t as any).weight ?? 1);
        totalWeight += ((t as any).weight ?? 1);
    }

    return Math.round((weightedScore / totalWeight) * 100);
}

/**
 * Problem Volume Score (0–100)
 * Normalized against 300 total problems benchmark.
 * Bonus for solving hard problems (each hard = 2x medium in volume score).
 */
export function calcProblemVolume(
    totalSolved: number,
    hardSolved: number,
    mediumSolved: number
): number {
    // Weighted total: hard counts double, medium counts 1.5x
    const weightedTotal = (totalSolved - hardSolved - mediumSolved) + (mediumSolved * 1.5) + (hardSolved * 2);
    const weightedBenchmark = VOLUME_BENCHMARK * 1.4; // adjust benchmark accordingly
    return Math.min(100, Math.round((weightedTotal / weightedBenchmark) * 100));
}

/**
 * Difficulty Balance Score (0–100)
 * Optimal FAANG balance: 30% easy, 50% medium, 20% hard
 * Penalizes over-reliance on easy problems heavily.
 */
export function calcDifficultyBalance(
    easySolved: number,
    mediumSolved: number,
    hardSolved: number
): number {
    const total = easySolved + mediumSolved + hardSolved;
    if (total === 0) return 0;

    const easyRatio = easySolved / total;
    const mediumRatio = mediumSolved / total;
    const hardRatio = hardSolved / total;

    // Ideal ratios
    const idealEasy = 0.30;
    const idealMedium = 0.50;
    const idealHard = 0.20;

    // Penalize deviation from ideal. Max deviation = 1 (complete mismatch)
    const easyDev = Math.abs(easyRatio - idealEasy);
    const mediumDev = Math.abs(mediumRatio - idealMedium);
    const hardDev = Math.abs(hardRatio - idealHard);

    // Medium and hard deviations penalized more (they matter more for FAANG)
    const weightedDev = (easyDev * 0.2) + (mediumDev * 0.5) + (hardDev * 0.3);

    // Convert to 0–100. Max possible weighted deviation ~ 0.8
    const score = Math.max(0, Math.round((1 - weightedDev / 0.5) * 100));
    return Math.min(100, score);
}

/**
 * Consistency Score (0–100)
 * Based on streak, total active days, and recent activity.
 */
export function calcConsistency(
    streak: number,
    totalActiveDays: number,
    submissionsLast30Days: number
): number {
    // Streak component (40% of consistency)
    const streakScore = Math.min(100, (streak / STREAK_BENCHMARK) * 100) * 0.40;

    // Active days component (35% of consistency)
    const activeDaysScore = Math.min(100, (totalActiveDays / ACTIVE_DAYS_BENCHMARK) * 100) * 0.35;

    // Recent 30-day activity component (25%): 30+ submissions in 30 days = full score
    const recentScore = Math.min(100, (submissionsLast30Days / 30) * 100) * 0.25;

    return Math.round(streakScore + activeDaysScore + recentScore);
}

/**
 * Parse submission calendar to count recent submissions.
 * calendar keys are unix timestamps (seconds), values are submission counts.
 */
export function parseSubmissionCalendar(
    calendar: Record<string, number>,
    days: number
): number {
    const now = Math.floor(Date.now() / 1000);
    const cutoff = now - days * 86400;

    return Object.entries(calendar).reduce((total, [timestamp, count]) => {
        return parseInt(timestamp) >= cutoff ? total + count : total;
    }, 0);
}

// ─── Main Score Calculator ────────────────────────────────────

export interface ScoreInputs {
    rawProfile: LeetCodeRawProfile;
    topics: TopicStat[];
}

export function calculateScore(inputs: ScoreInputs): ScoreBreakdown {
    const { rawProfile, topics } = inputs;

    const submissionsLast30Days = parseSubmissionCalendar(rawProfile.submissionCalendar, 30);
    const submissionsLast7Days = parseSubmissionCalendar(rawProfile.submissionCalendar, 7);

    // Individual metric scores
    const topicCoverage = calcTopicCoverage(topics);
    const problemVolume = calcProblemVolume(rawProfile.totalSolved, rawProfile.hardSolved, rawProfile.mediumSolved);
    const difficultyBalance = calcDifficultyBalance(rawProfile.easySolved, rawProfile.mediumSolved, rawProfile.hardSolved);
    const consistency = calcConsistency(rawProfile.streak, rawProfile.totalActiveDays, submissionsLast30Days);

    // Weighted total score
    const total = Math.round(
        topicCoverage * WEIGHTS.TOPIC_COVERAGE +
        problemVolume * WEIGHTS.PROBLEM_VOLUME +
        difficultyBalance * WEIGHTS.DIFFICULTY_BALANCE +
        consistency * WEIGHTS.CONSISTENCY
    );

    // Derived stats
    const strongTopicsCount = topics.filter(t => t.status === "strong").length;
    const weakTopicsCount = topics.filter(t => t.status === "weak").length;
    const averageTopicsCount = topics.filter(t => t.status === "average").length;

    const totalSolved = rawProfile.totalSolved || 1;
    const mediumRatio = rawProfile.mediumSolved / totalSolved;
    const hardRatio = rawProfile.hardSolved / totalSolved;

    return {
        total: Math.min(100, Math.max(0, total)),
        topicCoverage,
        problemVolume,
        difficultyBalance,
        consistency,
        strongTopicsCount,
        weakTopicsCount,
        averageTopicsCount,
        mediumRatio: Math.round(mediumRatio * 100) / 100,
        hardRatio: Math.round(hardRatio * 100) / 100,
        submissionsLast30Days,
        longestStreak: rawProfile.streak,
    };
}

/**
 * Determines the readiness level label from a total score.
 */
export function getReadinessLevel(totalScore: number): ReadinessLevel {
    if (totalScore >= 92) return READINESS_LEVELS[7]; // Elite
    if (totalScore >= 80) return READINESS_LEVELS[6]; // FAANG Ready
    if (totalScore >= 70) return READINESS_LEVELS[5]; // Competitive
    if (totalScore >= 58) return READINESS_LEVELS[4]; // Getting There
    if (totalScore >= 45) return READINESS_LEVELS[3]; // Intermediate
    if (totalScore >= 32) return READINESS_LEVELS[2]; // Developing
    if (totalScore >= 18) return READINESS_LEVELS[1]; // Beginner
    return READINESS_LEVELS[0];                        // Not Ready
}
