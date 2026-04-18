// ============================================================
// UNIPATH SCHOOL — FAANG Readiness Engine
// lib/engine/skillGapEngine.ts
// Detects topic gaps, ranks by urgency, estimates close time
// ============================================================

import type { TopicStat, SkillGap, SkillGapReport, Phase } from "../types";
import { TOPIC_MAP } from "./topicMapper";

// Average problems a student can solve per day (conservative estimate)
const AVG_PROBLEMS_PER_DAY = 3;

// Phase prerequisite order — you should not jump to phase 3 if phase 1 has critical gaps
const PHASE_ORDER: Record<Phase, number> = {
    "Foundation": 1,
    "Data Structures": 2,
    "Algorithms": 3,
    "Advanced": 4,
};

// FAANG interview topic importance weights (used for urgency calculation)
const FAANG_CRITICAL_TOPICS = new Set([
    "dynamic-programming",
    "graph",
    "tree",
    "array",
    "depth-first-search",
    "breadth-first-search",
    "backtracking",
    "binary-search",
]);

/**
 * Determines urgency level of a skill gap.
 * Factors: gap size, topic importance, phase priority
 */
function calcUrgency(
    topicSlug: string,
    gapSize: number,
    threshold: number,
    phase: Phase
): SkillGap["urgency"] {
    const isCriticalTopic = FAANG_CRITICAL_TOPICS.has(topicSlug);
    const isCriticalPhase = phase === "Foundation" || phase === "Data Structures";
    const gapRatio = gapSize / threshold; // 0–1, higher = more urgent

    // Critical: foundational topic with large gap AND it's a core FAANG topic
    if (isCriticalTopic && isCriticalPhase && gapRatio > 0.6) return "critical";
    if (isCriticalTopic && gapRatio > 0.5) return "critical";

    // High: important topic with significant gap
    if (isCriticalPhase && gapRatio > 0.5) return "high";
    if (isCriticalTopic && gapRatio > 0.3) return "high";

    // Medium: some gap but manageable
    if (gapRatio > 0.3) return "medium";

    // Low: close to threshold
    return "low";
}

/**
 * Builds the full Skill Gap Report from analyzed topic stats.
 */
export function buildSkillGapReport(topics: TopicStat[]): SkillGapReport {
    const gaps: SkillGap[] = [];

    for (const topic of topics) {
        // Only gaps where student hasn't reached threshold
        if (topic.solved >= topic.threshold) continue;

        const gapSize = topic.threshold - topic.solved;
        const topicSlug = topic.tagSlug;
        const urgency = calcUrgency(topicSlug, gapSize, topic.threshold, topic.phase);
        const estimatedDaysToClose = Math.ceil(gapSize / AVG_PROBLEMS_PER_DAY);

        // Get suggested problems from topic config
        const topicConfig = TOPIC_MAP[topicSlug];
        const suggestedProblems = topicConfig?.mustSolveProblems.slice(0, 3) ?? [];

        gaps.push({
            topic: topic.topic,
            phase: topic.phase,
            currentSolved: topic.solved,
            targetThreshold: topic.threshold,
            gapSize,
            urgency,
            estimatedDaysToClose,
            suggestedProblems,
        });
    }

    // Sort gaps: critical first, then by phase order, then by gap size
    gaps.sort((a, b) => {
        const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        if (urgencyDiff !== 0) return urgencyDiff;

        const phaseDiff = PHASE_ORDER[a.phase] - PHASE_ORDER[b.phase];
        if (phaseDiff !== 0) return phaseDiff;

        return b.gapSize - a.gapSize;
    });

    // Categorize
    const criticalGaps = gaps.filter(g => g.urgency === "critical");
    const highGaps = gaps.filter(g => g.urgency === "high");
    const mediumGaps = gaps.filter(g => g.urgency === "medium");
    const lowGaps = gaps.filter(g => g.urgency === "low");

    // Total gap problems
    const totalGapProblems = gaps.reduce((sum, g) => sum + g.gapSize, 0);

    // Estimate total days if solving AVG_PROBLEMS_PER_DAY
    const estimatedDaysToFAANGReady = Math.ceil(totalGapProblems / AVG_PROBLEMS_PER_DAY);

    // Top priority topic (first critical or high gap)
    const topPriorityTopic = gaps[0]?.topic ?? "Arrays";

    return {
        criticalGaps,
        highGaps,
        mediumGaps,
        lowGaps,
        totalGapProblems,
        estimatedDaysToFAANGReady,
        topPriorityTopic,
    };
}

/**
 * Computes a per-topic priority score for roadmap ordering.
 * Higher priority = should focus on sooner.
 * Formula: (phase_weight × 40%) + (faang_importance × 35%) + (gap_ratio × 25%)
 */
export function calcTopicPriorityScore(
    topicSlug: string,
    phase: Phase,
    gapRatio: number // 0–1: how much of the threshold is still unfilled
): number {
    const phaseWeight = (5 - PHASE_ORDER[phase]) / 4; // Foundation=1, Advanced=0.25
    const faangImportance = FAANG_CRITICAL_TOPICS.has(topicSlug) ? 1 : 0.5;

    return (phaseWeight * 0.40) + (faangImportance * 0.35) + (gapRatio * 0.25);
}
