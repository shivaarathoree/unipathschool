// ============================================================
// UNIPATH SCHOOL — FAANG Readiness Engine
// lib/engine/roadmapGenerator.ts
// Builds the personalized phased roadmap from analyzed profile
// ============================================================

import type {
    TopicStat,
    ScoreBreakdown,
    Roadmap,
    RoadmapPhase,
    RoadmapTopic,
    Milestone,
    Phase,
    PhaseStatus,
} from "../types";
import { TOPIC_MAP } from "./topicMapper";

const PHASE_COMPLETION_THRESHOLD = 0.80; // 80%+ topics strong = phase complete
const PHASE_INPROGRESS_THRESHOLD = 0.30; // 30%+ topics average/strong = in-progress
const WEEKLY_PROBLEM_TARGET_BY_PHASE: Record<Phase, number> = {
    "Foundation": 15,
    "Data Structures": 12,
    "Algorithms": 10,
    "Advanced": 8,
};

/**
 * Determines a phase's status from its topics.
 */
function calcPhaseStatus(phaseTopics: TopicStat[]): PhaseStatus {
    if (phaseTopics.length === 0) return "locked";

    const strongOrAverage = phaseTopics.filter(t => t.status !== "weak").length;
    const ratio = strongOrAverage / phaseTopics.length;

    if (ratio >= PHASE_COMPLETION_THRESHOLD) return "complete";
    if (ratio >= PHASE_INPROGRESS_THRESHOLD) return "in-progress";
    return "locked";
}

/**
 * Calculates estimated weeks to complete a phase given current problems done,
 * target problems, and a weekly problem rate.
 */
function estimateWeeks(done: number, target: number, weeklyRate: number): number {
    const remaining = Math.max(0, target - done);
    return Math.ceil(remaining / weeklyRate);
}

/**
 * Phase key insights — motivational + educational messages per phase.
 */
const PHASE_KEY_INSIGHTS: Record<Phase, string> = {
    "Foundation":
        "Master arrays, strings, and hash tables first. 70% of phone screens test only these topics. Get fast before going deep.",
    "Data Structures":
        "Trees and graphs are the backbone of FAANG interviews. Understand them deeply — not just the code, but the intuition.",
    "Algorithms":
        "Dynamic programming separates FAANG candidates. Solve 20+ DP problems and you unlock solutions to hundreds of variations.",
    "Advanced":
        "Trie, Union-Find, and Topological Sort appear in 1 in 4 Google/Meta onsite rounds. These are differentiators.",
};

/**
 * Generates milestones based on score.
 */
function generateMilestones(score: ScoreBreakdown, currentScore: number): Milestone[] {
    return [
        {
            title: "Foundation Mastery",
            targetScore: 40,
            achieved: currentScore >= 40,
            reward: "Unlocks Data Structures phase — phone screen ready",
        },
        {
            title: "Data Structures Complete",
            targetScore: 55,
            achieved: currentScore >= 55,
            reward: "Mid-level engineer interview ready at most companies",
        },
        {
            title: "Algorithm Proficiency",
            targetScore: 70,
            achieved: currentScore >= 70,
            reward: "Ready for FAANG phone screens and OAs",
        },
        {
            title: "FAANG Threshold",
            targetScore: 80,
            achieved: currentScore >= 80,
            reward: "On-site interview ready — keep grinding hard problems",
        },
        {
            title: "Elite Candidate",
            targetScore: 92,
            achieved: currentScore >= 92,
            reward: "Top 5% of FAANG candidates globally. Apply now.",
        },
    ];
}

/**
 * Main roadmap generator.
 * Takes analyzed topics + score and builds the structured phased roadmap.
 */
export function generateRoadmap(
    topics: TopicStat[],
    score: ScoreBreakdown,
    totalScore: number
): Roadmap {
    const phases: Phase[] = ["Foundation", "Data Structures", "Algorithms", "Advanced"];
    const roadmapPhases: RoadmapPhase[] = [];

    let totalEstimatedWeeks = 0;
    let currentFocus: Phase = "Foundation";
    let foundCurrentFocus = false;

    for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        const phaseTopics = topics.filter(t => t.phase === phase);

        const phaseStatus = calcPhaseStatus(phaseTopics);

        // Current focus = first non-complete phase
        if (!foundCurrentFocus && phaseStatus !== "complete") {
            currentFocus = phase;
            foundCurrentFocus = true;
        }

        // Build roadmap topics sorted by priority (weakest/most important first)
        const roadmapTopics: RoadmapTopic[] = phaseTopics
            .sort((a, b) => b.priorityScore - a.priorityScore)
            .map(t => {
                const config = TOPIC_MAP[t.tagSlug];
                return {
                    topic: t.topic,
                    tagSlug: t.tagSlug,
                    solved: t.solved,
                    threshold: t.threshold,
                    status: t.status,
                    weeklyTarget: Math.max(3, Math.ceil((t.threshold - t.solved) / 4)),
                    mustSolveProblems: config?.mustSolveProblems ?? [],
                };
            });

        const problemsDone = phaseTopics.reduce((s, t) => s + t.solved, 0);
        const problemTarget = phaseTopics.reduce((s, t) => s + t.threshold, 0);
        const completionPct = problemTarget === 0
            ? 0
            : Math.min(100, Math.round((problemsDone / problemTarget) * 100));

        const weeklyRate = WEEKLY_PROBLEM_TARGET_BY_PHASE[phase];
        const estWeeks = phaseStatus === "complete"
            ? 0
            : estimateWeeks(problemsDone, problemTarget, weeklyRate);

        totalEstimatedWeeks += estWeeks;

        const phaseNumber = (i + 1) as 1 | 2 | 3 | 4;

        roadmapPhases.push({
            phase,
            phaseNumber,
            status: phaseStatus,
            completionPercent: completionPct,
            topics: roadmapTopics,
            problemTarget,
            problemsDone,
            estimatedWeeks: estWeeks,
            keyInsight: PHASE_KEY_INSIGHTS[phase],
        });
    }

    const weeklyProblemTarget = WEEKLY_PROBLEM_TARGET_BY_PHASE[currentFocus];
    const milestones = generateMilestones(score, totalScore);

    return {
        phases: roadmapPhases,
        totalEstimatedWeeks,
        currentFocus,
        weeklyProblemTarget,
        milestones,
    };
}
