// ============================================================
// UNIPATH SCHOOL — FAANG Readiness Engine
// lib/leetcode/parser.ts
// Transforms raw LeetCode data into fully analyzed FANGProfile
// ============================================================

import type {
    LeetCodeRawProfile,
    LeetCodeTagCount,
    TopicStat,
    FANGProfile,
    CompanyTrack,
    CompanyName,
    RecommendedProblem,
} from "../types";
import { TOPIC_MAP, normalizeTag } from "../engine/topicMapper";
import { calculateScore, getReadinessLevel, parseSubmissionCalendar } from "../engine/scoreCalculator";
import { buildSkillGapReport, calcTopicPriorityScore } from "../engine/skillGapEngine";
import { generateRoadmap } from "../engine/roadmapGenerator";

// ─── Company Track Definitions ────────────────────────────────

const COMPANY_TRACK_CONFIGS: Array<{
    company: CompanyName;
    color: string;
    logo: string;
    focusTopics: string[];
    topicWeights: Record<string, number>;
    interviewStyle: string;
    roundsCount: number;
    dsaWeight: number;
    systemDesignWeight: number;
    behavioralWeight: number;
    keyTip: string;
}> = [
        {
            company: "Google",
            color: "#4285f4",
            logo: "G",
            focusTopics: ["Arrays", "Graphs", "Dynamic Programming", "Trie", "BFS", "DFS", "Strings"],
            topicWeights: { "dynamic-programming": 0.95, "graph": 0.92, "array": 0.90, "trie": 0.85, "depth-first-search": 0.88 },
            interviewStyle: "Algorithmic depth + clean code. Expect follow-ups on every solution. Optimize, optimize, optimize.",
            roundsCount: 5,
            dsaWeight: 70,
            systemDesignWeight: 20,
            behavioralWeight: 10,
            keyTip: "Google values elegant, generalizable solutions over brute-force. Always discuss time/space complexity.",
        },
        {
            company: "Amazon",
            color: "#ff9900",
            logo: "A",
            focusTopics: ["Trees", "Graphs", "Greedy", "Hash Tables", "Arrays", "Two Pointers"],
            topicWeights: { "tree": 0.90, "graph": 0.85, "greedy": 0.82, "hash-table": 0.88, "array": 0.85 },
            interviewStyle: "Leadership Principles in EVERY round. DSA + behavioral simultaneously. Show ownership.",
            roundsCount: 6,
            dsaWeight: 55,
            systemDesignWeight: 20,
            behavioralWeight: 25,
            keyTip: "Prepare STAR stories for all 16 Leadership Principles. Amazon rejects strong coders for weak behavioral answers.",
        },
        {
            company: "Meta",
            color: "#0866ff",
            logo: "M",
            focusTopics: ["Graphs", "BFS/DFS", "Dynamic Programming", "Strings", "Arrays", "Backtracking"],
            topicWeights: { "graph": 0.95, "depth-first-search": 0.90, "dynamic-programming": 0.90, "string": 0.85, "backtracking": 0.80 },
            interviewStyle: "Speed-focused. Two coding problems per round. Write bug-free code fast under pressure.",
            roundsCount: 5,
            dsaWeight: 75,
            systemDesignWeight: 15,
            behavioralWeight: 10,
            keyTip: "Practice coding on paper/whiteboard. Meta values writing clean, correct code quickly — not just the approach.",
        },
        {
            company: "Apple",
            color: "#555555",
            logo: "🍎",
            focusTopics: ["Arrays", "Strings", "Trees", "Hash Tables", "Bit Manipulation"],
            topicWeights: { "array": 0.92, "string": 0.90, "tree": 0.88, "hash-table": 0.85, "bit-manipulation": 0.75 },
            interviewStyle: "Design-heavy. Expect questions on UX, APIs, and system architecture alongside DSA.",
            roundsCount: 4,
            dsaWeight: 60,
            systemDesignWeight: 25,
            behavioralWeight: 15,
            keyTip: "Apple interviews often blur DSA and system design. Know your fundamentals AND be able to design systems.",
        },
        {
            company: "Microsoft",
            color: "#00a4ef",
            logo: "⊞",
            focusTopics: ["Trees", "Linked Lists", "Strings", "Dynamic Programming", "Arrays"],
            topicWeights: { "tree": 0.90, "linked-list": 0.85, "string": 0.88, "dynamic-programming": 0.85, "array": 0.88 },
            interviewStyle: "Collaborative coding style. Interviewers are helpful. Strong emphasis on communication.",
            roundsCount: 4,
            dsaWeight: 65,
            systemDesignWeight: 20,
            behavioralWeight: 15,
            keyTip: "Think out loud constantly. Microsoft interviewers want to see your problem-solving process, not just the answer.",
        },
        {
            company: "Netflix",
            color: "#e50914",
            logo: "N",
            focusTopics: ["System Design", "Dynamic Programming", "Graphs", "Arrays"],
            topicWeights: { "dynamic-programming": 0.85, "graph": 0.80, "array": 0.82 },
            interviewStyle: "Senior-focused. Culture fit (Freedom & Responsibility) is heavily weighted. Senior-level bar.",
            roundsCount: 4,
            dsaWeight: 40,
            systemDesignWeight: 40,
            behavioralWeight: 20,
            keyTip: "Netflix hires seniors only. System design skills and owning large-scale decisions matter more than LeetCode.",
        },
    ];

// ─── Tag Aggregator ───────────────────────────────────────────

function aggregateTags(raw: LeetCodeRawProfile): Map<string, number> {
    const tagMap = new Map<string, number>();

    const allTags: LeetCodeTagCount[] = [
        ...(raw.tagProblemCounts?.fundamental ?? []),
        ...(raw.tagProblemCounts?.intermediate ?? []),
        ...(raw.tagProblemCounts?.advanced ?? []),
    ];

    for (const tag of allTags) {
        const normalizedKey = normalizeTag(tag.tagSlug ?? tag.tagName.toLowerCase().replace(/\s+/g, "-"));
        if (normalizedKey) {
            const existing = tagMap.get(normalizedKey) ?? 0;
            tagMap.set(normalizedKey, Math.max(existing, tag.problemsSolved));
        }
    }

    return tagMap;
}

// ─── Topic Builder ────────────────────────────────────────────

function buildTopicStats(tagMap: Map<string, number>): TopicStat[] {
    const topics: TopicStat[] = [];

    for (const [slug, config] of Object.entries(TOPIC_MAP)) {
        const solved = tagMap.get(slug) ?? 0;
        const gapCount = config.threshold - solved;
        const percentComplete = Math.min(100, Math.round((solved / config.threshold) * 100));
        const status = solved >= config.threshold
            ? "strong"
            : solved >= config.averageThreshold
                ? "average"
                : "weak";

        const gapRatio = gapCount > 0 ? gapCount / config.threshold : 0;
        const priorityScore = calcTopicPriorityScore(slug, config.phase, gapRatio);

        topics.push({
            topic: config.displayName,
            tagSlug: slug,
            solved,
            threshold: config.threshold,
            phase: config.phase,
            status,
            percentComplete,
            gapCount: Math.max(0, gapCount),
            priorityScore,
            relatedProblems: config.mustSolveProblems,
        } as TopicStat & { weight: number });

        // Attach weight for score calculation
        (topics[topics.length - 1] as any).weight = config.weight;
    }

    return topics;
}

// ─── Company Track Builder ────────────────────────────────────

function buildCompanyTracks(topics: TopicStat[], totalScore: number): CompanyTrack[] {
    return COMPANY_TRACK_CONFIGS.map(config => {
        // Calculate per-company readiness score
        const relevantTopics = topics.filter(t =>
            config.focusTopics.some(ft =>
                t.topic.toLowerCase().includes(ft.toLowerCase()) ||
                ft.toLowerCase().includes(t.topic.toLowerCase())
            )
        );

        let weightedScore = 0;
        let totalWeight = 0;

        for (const topic of relevantTopics) {
            const weight = config.topicWeights[topic.tagSlug] ?? 0.7;
            const completion = Math.min(1, topic.solved / topic.threshold);
            weightedScore += completion * weight;
            totalWeight += weight;
        }

        const baseScore = totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;
        // Blend with overall score (company score is 60% topic-specific, 40% overall)
        const readinessScore = Math.round(baseScore * 0.6 + totalScore * 0.4);

        // Top gap topics for this company
        const topGapTopics = relevantTopics
            .filter(t => t.status === "weak")
            .sort((a, b) => b.priorityScore - a.priorityScore)
            .slice(0, 3)
            .map(t => t.topic);

        // Must-solve problems for this company
        const mustSolveProblems: RecommendedProblem[] = relevantTopics
            .flatMap(t => t.relatedProblems)
            .filter(p => p.companies?.some(c => c === config.company))
            .slice(0, 6);

        return {
            ...config,
            readinessScore: Math.min(100, Math.max(0, readinessScore)),
            topGapTopics,
            mustSolveProblems,
        };
    });
}

// ─── Top Recommended Problems ─────────────────────────────────

function buildTopRecommendedProblems(topics: TopicStat[]): RecommendedProblem[] {
    // Prioritize: weak topics → high frequency → top interview problems
    const weakTopics = topics
        .filter(t => t.status === "weak")
        .sort((a, b) => b.priorityScore - a.priorityScore);

    const seen = new Set<number>();
    const problems: RecommendedProblem[] = [];

    for (const topic of weakTopics) {
        for (const problem of topic.relatedProblems) {
            if (!seen.has(problem.id)) {
                seen.add(problem.id);
                problems.push(problem);
            }
        }
        if (problems.length >= 20) break;
    }

    // Sort by interview frequency descending
    return problems
        .sort((a, b) => (b.frequency ?? 0) - (a.frequency ?? 0))
        .slice(0, 20);
}

// ─── Main Parser ──────────────────────────────────────────────

export function parseProfile(
    raw: LeetCodeRawProfile,
    source: "leetcode-graphql" | "alfa-api"
): FANGProfile {
    // Step 1: Aggregate topic tags
    const tagMap = aggregateTags(raw);

    // Step 2: Build structured topic stats
    const topics = buildTopicStats(tagMap);

    // Step 3: Calculate readiness score
    const score = calculateScore({ rawProfile: raw, topics });
    const readinessLevel = getReadinessLevel(score.total);

    // Step 4: Build skill gap report
    const skillGapReport = buildSkillGapReport(topics);

    // Step 5: Generate roadmap
    const roadmap = generateRoadmap(topics, score, score.total);

    // Step 6: Build company tracks
    const companyTracks = buildCompanyTracks(topics, score.total);

    // Step 7: Top recommended problems
    const topRecommendedProblems = buildTopRecommendedProblems(topics);

    // Step 8: Submission activity
    const submissionsLast30Days = parseSubmissionCalendar(raw.submissionCalendar, 30);
    const submissionsLast7Days = parseSubmissionCalendar(raw.submissionCalendar, 7);

    return {
        fetchedAt: new Date().toISOString(),
        cacheHit: false,
        dataSource: source,
        username: raw.username,
        realName: raw.realName,
        avatar: raw.avatar,
        ranking: raw.ranking,
        streak: raw.streak,
        totalActiveDays: raw.totalActiveDays,
        badges: raw.badges,
        recentSubmissions: raw.recentSubmissions,
        totalSolved: raw.totalSolved,
        easySolved: raw.easySolved,
        mediumSolved: raw.mediumSolved,
        hardSolved: raw.hardSolved,
        acceptanceRate: raw.acceptanceRate,
        submissionsLast30Days,
        submissionsLast7Days,
        topics,
        score,
        readinessLevel,
        skillGapReport,
        roadmap,
        companyTracks,
        topRecommendedProblems,
        submissionCalendar: raw.submissionCalendar,
    };
}
