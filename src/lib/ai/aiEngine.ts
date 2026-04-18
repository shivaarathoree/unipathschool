// ============================================================
// UNIPATH SCHOOL — FAANG Readiness Engine
// lib/ai/aiEngine.ts
// Gemini (primary) + Grok (fallback) with expert-level prompts
// ============================================================

import type {
    FANGProfile,
    AIStudyPlan,
    AIInterviewFeedback,
    AICompanyInsight,
    AIProvider,
    CompanyName,
    StudyWeek,
} from "../types";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
const GROK_API_KEY = process.env.GROK_API_KEY ?? "";

const TIMEOUT_MS = 30000;

// ─── System Persona (injected into every AI call) ────────────
// This is the core of what makes UniPath's AI analysis superior.

const SYSTEM_PERSONA = `You are Dr. FAANG — UniPath School's elite AI interview preparation engine, trained on patterns from 50,000+ FAANG interview experiences, Glassdoor reports, LeetCode Discuss, and data from candidates who received offers from Google, Amazon, Meta, Apple, and Microsoft.

Your analysis is SURGICAL. Every recommendation is backed by:
- Real interview frequency data
- Topic co-occurrence patterns (which topics appear together in rounds)
- Time-to-learn estimates calibrated to 10,000+ student journeys
- Company-specific hiring bar intelligence

You NEVER give generic advice. You diagnose the EXACT weakness, explain WHY it matters at FAANG specifically, and give a CONCRETE action plan with specific LeetCode problem numbers.

Your tone: Direct, expert, slightly intense. Like a coach who has gotten 200 students into Google and genuinely cares about getting this one in too.

Output FORMAT: Always structured JSON unless instructed otherwise. Never markdown outside of designated fields.`;

// ─── API Callers ──────────────────────────────────────────────

async function callGemini(prompt: string, systemContext: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: `${systemContext}\n\n---\n\n${prompt}` }],
                    },
                ],
                generationConfig: {
                    temperature: 0.4,        // Low temp = consistent, expert analysis
                    topP: 0.85,
                    maxOutputTokens: 4096,
                    responseMimeType: "application/json",
                },
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                ],
            }),
        });

        clearTimeout(timeoutId);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Gemini HTTP ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Empty Gemini response");
        return text;

    } catch (err: any) {
        clearTimeout(timeoutId);
        console.error("[callGemini] failed:", err.message);
        throw err;
    }
}

async function callGrok(prompt: string, systemContext: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(GROK_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROK_API_KEY}`,
            },
            signal: controller.signal,
            body: JSON.stringify({
                model: "grok-2-latest",
                messages: [
                    { role: "system", content: systemContext },
                    { role: "user", content: prompt },
                ],
                temperature: 0.4,
                max_tokens: 4096,
                response_format: { type: "json_object" },
            }),
        });

        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`Grok HTTP ${response.status}`);

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (!text) throw new Error("Empty Grok response");
        return text;

    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
}

/**
 * Tries Gemini first, falls back to Grok on any error.
 * Returns { text, provider }
 */
async function callAI(
    prompt: string,
    systemContext: string
): Promise<{ text: string; provider: AIProvider }> {
    // Try Gemini first
    if (GEMINI_API_KEY) {
        try {
            const text = await callGemini(prompt, systemContext);
            return { text, provider: "gemini" };
        } catch (err: any) {
            console.warn(`[FANGEngine] Gemini failed: ${err.message}. Falling back to Grok...`);
        }
    }

    // Fallback to Grok
    if (GROK_API_KEY) {
        try {
            const text = await callGrok(prompt, systemContext);
            return { text, provider: "grok" };
        } catch (err: any) {
            throw new Error(`Both AI providers failed. Last error: ${err.message}`);
        }
    }

    throw new Error("No AI API keys configured. Set GEMINI_API_KEY or GROK_API_KEY.");
}

function safeJsonParse<T>(text: string, fallback: T): T {
    try {
        // Strip markdown fences if present
        const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        return JSON.parse(clean);
    } catch {
        console.error("[FANGEngine] JSON parse failed:", text.slice(0, 200));
        return fallback;
    }
}

// ─── Study Plan Generator ─────────────────────────────────────

export async function generateStudyPlan(profile: FANGProfile): Promise<AIStudyPlan> {
    const weakTopics = profile.topics.filter(t => t.status === "weak").map(t => `${t.topic} (${t.solved}/${t.threshold} solved)`);
    const averageTopics = profile.topics.filter(t => t.status === "average").map(t => `${t.topic} (${t.solved}/${t.threshold} solved)`);
    const criticalGaps = profile.skillGapReport.criticalGaps.map(g => g.topic);
    const currentFocus = profile.roadmap.currentFocus;

    const prompt = `
Generate a hyper-personalized 4-week FAANG preparation plan for this engineering student.

STUDENT PROFILE:
- Username: ${profile.username}
- Readiness Score: ${profile.score.total}/100 (${profile.readinessLevel.label})
- Total Problems Solved: ${profile.totalSolved} (Easy: ${profile.easySolved}, Medium: ${profile.mediumSolved}, Hard: ${profile.hardSolved})
- Consistency: ${profile.score.longestStreak} day streak, ${profile.submissionsLast30Days} submissions last 30 days
- Current Focus Phase: ${currentFocus}

WEAK AREAS (CRITICAL — must address):
${weakTopics.join("\n")}

AVERAGE AREAS (needs strengthening):
${averageTopics.join("\n")}

MOST URGENT GAPS:
${criticalGaps.join(", ")}

SCORE BREAKDOWN:
- Topic Coverage: ${profile.score.topicCoverage}/100
- Problem Volume: ${profile.score.problemVolume}/100  
- Difficulty Balance: ${profile.score.difficultyBalance}/100
- Consistency: ${profile.score.consistency}/100

GENERATE: A precise 4-week plan. Each week must have:
1. A thematic focus tied to the student's ACTUAL weaknesses
2. Daily problems by name + LeetCode ID + difficulty + WHY this specific problem for this student
3. A weekly checkpoint test description
4. A motivational insight connecting this week's work to FAANG success

CONSTRAINTS:
- Week 1 must address the #1 critical gap: ${criticalGaps[0] ?? "Arrays"}
- Difficulty progression: start at their current level, push 20% harder each week
- Include EXACTLY 5 problems per day × 6 days = 30 problems/week
- Problems must be REAL LeetCode problems with correct IDs
- The plan must be realistic for someone who solved ${profile.totalSolved} problems total

Return ONLY this JSON structure:
{
  "focusMessage": "2-sentence personalized overview of what this student needs most",
  "warningMessage": "1 sentence about the biggest risk to their FAANG journey (be blunt)",
  "totalProblems": 120,
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "Week theme title",
      "topics": ["topic1", "topic2"],
      "weeklyGoal": "Specific, measurable goal for this week",
      "checkpointTest": "Describe a mini-assessment to test week's learning",
      "dailyProblems": [
        {
          "day": 1,
          "problem": {
            "id": 1,
            "title": "Two Sum",
            "titleSlug": "two-sum",
            "difficulty": "Easy",
            "topic": "Arrays",
            "frequency": 0.97,
            "leetcodeUrl": "https://leetcode.com/problems/two-sum/"
          },
          "whyThisProblem": "Specific reason this problem matters for THIS student's gaps"
        }
      ]
    }
  ]
}`;

    const { text, provider } = await callAI(prompt, SYSTEM_PERSONA);
    const parsed = safeJsonParse<any>(text, {});

    return {
        provider,
        generatedAt: new Date().toISOString(),
        weeks: parsed.weeks ?? [],
        totalProblems: parsed.totalProblems ?? 120,
        focusMessage: parsed.focusMessage ?? "Focus on your critical gaps first.",
        warningMessage: parsed.warningMessage,
    };
}

// ─── Interview Feedback ───────────────────────────────────────

export async function getInterviewFeedback(
    profile: FANGProfile,
    question: string,
    answer: string,
    questionCategory: string
): Promise<AIInterviewFeedback> {
    const prompt = `
You are conducting a FAANG technical interview round. A candidate just answered a question.

CANDIDATE PROFILE:
- Readiness Score: ${profile.score.total}/100 (${profile.readinessLevel.label})
- Strongest topics: ${profile.topics.filter(t => t.status === "strong").map(t => t.topic).join(", ") || "None yet"}
- Weakest topics: ${profile.topics.filter(t => t.status === "weak").map(t => t.topic).slice(0, 5).join(", ")}
- Total problems solved: ${profile.totalSolved}

QUESTION CATEGORY: ${questionCategory}
QUESTION: ${question}

CANDIDATE'S ANSWER:
${answer}

EVALUATE this answer as a REAL FAANG interviewer would. Consider:
1. Correctness of the core approach
2. Time/space complexity awareness
3. Edge case handling
4. Code quality and communication clarity
5. How this compares to what a hired FAANG engineer would say

Return ONLY this JSON:
{
  "score": 7,
  "verdict": "Borderline",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3"],
  "modelAnswer": "The ideal answer a hired FAANG engineer would give — be specific and technical",
  "timeComplexity": "O(n log n)",
  "spaceComplexity": "O(n)",
  "followUpQuestion": "A harder follow-up question a real interviewer would ask next"
}`;

    const { text, provider } = await callAI(prompt, SYSTEM_PERSONA);
    const parsed = safeJsonParse<any>(text, {});

    return {
        provider,
        score: parsed.score ?? 5,
        verdict: parsed.verdict ?? "Borderline",
        strengths: parsed.strengths ?? [],
        improvements: parsed.improvements ?? [],
        modelAnswer: parsed.modelAnswer ?? "",
        timeComplexity: parsed.timeComplexity,
        spaceComplexity: parsed.spaceComplexity,
        followUpQuestion: parsed.followUpQuestion ?? "",
    };
}

// ─── Company-Specific Insight ─────────────────────────────────

export async function getCompanyInsight(
    profile: FANGProfile,
    company: CompanyName
): Promise<AICompanyInsight> {
    const companyTrack = profile.companyTracks.find(t => t.company === company);
    const relevantGaps = profile.skillGapReport.criticalGaps
        .concat(profile.skillGapReport.highGaps)
        .filter(g => companyTrack?.focusTopics.some(ft => ft.toLowerCase().includes(g.topic.toLowerCase())))
        .slice(0, 4);

    const prompt = `
Perform a company-specific FAANG readiness assessment for ${company}.

STUDENT PROFILE:
- Overall Score: ${profile.score.total}/100
- ${company} Readiness Score: ${companyTrack?.readinessScore ?? 0}/100
- Total Solved: ${profile.totalSolved}
- Difficulty: Easy ${profile.easySolved} / Medium ${profile.mediumSolved} / Hard ${profile.hardSolved}

${company.toUpperCase()} RELEVANT TOPIC GAPS:
${relevantGaps.map(g => `- ${g.topic}: ${g.currentSolved}/${g.targetThreshold} (${g.urgency} urgency, ~${g.estimatedDaysToClose} days to close)`).join("\n") || "No critical gaps in company-specific topics"}

COMPANY CONTEXT:
- Interview Style: ${companyTrack?.interviewStyle}
- DSA Weight: ${companyTrack?.dsaWeight}%
- System Design Weight: ${companyTrack?.systemDesignWeight}%
- Behavioral Weight: ${companyTrack?.behavioralWeight}%
- Key Tip: ${companyTrack?.keyTip}

Give a BRUTALLY HONEST assessment. Don't sugarcoat. This student needs to know:
1. Are they ACTUALLY ready for ${company}? (Be specific — not "almost ready")
2. What EXACTLY are the 2-3 biggest gaps specific to ${company}'s interview bar?
3. A concrete 3-step action plan to close those gaps

Return ONLY this JSON:
{
  "readinessAssessment": "Direct honest assessment of readiness for ${company} specifically",
  "gapAnalysis": "The 2-3 most critical gaps specific to what ${company} tests",
  "actionPlan": ["Step 1: specific action", "Step 2: specific action", "Step 3: specific action"],
  "estimatedPrepWeeks": 6,
  "confidenceLevel": "Medium"
}`;

    const { text, provider } = await callAI(prompt, SYSTEM_PERSONA);
    const parsed = safeJsonParse<any>(text, {});

    return {
        provider,
        company,
        readinessAssessment: parsed.readinessAssessment ?? "",
        gapAnalysis: parsed.gapAnalysis ?? "",
        actionPlan: parsed.actionPlan ?? [],
        estimatedPrepWeeks: parsed.estimatedPrepWeeks ?? 8,
        confidenceLevel: parsed.confidenceLevel ?? "Medium",
    };
}
