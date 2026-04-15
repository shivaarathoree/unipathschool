// ============================================================
// UNIPATH SCHOOL — FAANG Readiness Engine
// lib/leetcode/fetcher.ts
// Real LeetCode data fetching via GraphQL with fallback
// ============================================================

import type { LeetCodeRawProfile, LeetCodeTagCount, RecentSubmission } from "../types";

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";
const ALFA_API_URL = process.env.ALFA_API_URL ?? "https://alfa-leetcode-api.onrender.com";
const REQUEST_TIMEOUT_MS = 12000;

// ─── GraphQL Queries ──────────────────────────────────────────

const USER_PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        userAvatar
        ranking
        reputation
        starRating
        aboutMe
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      tagProblemCounts {
        advanced {
          tagName
          tagSlug
          problemsSolved
        }
        intermediate {
          tagName
          tagSlug
          problemsSolved
        }
        fundamental {
          tagName
          tagSlug
          problemsSolved
        }
      }
      badges {
        id
        displayName
        icon
        creationDate
      }
    }
  }
`;

const USER_CALENDAR_QUERY = `
  query userProfileCalendar($username: String!, $year: Int) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        activeYears
        streak
        totalActiveDays
        dccBadges {
          timestamp
          badge { name icon }
        }
        submissionCalendar
      }
    }
  }
`;

const RECENT_SUBMISSIONS_QUERY = `
  query getRecentSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
      statusDisplay
      lang
    }
  }
`;

// ─── Fetcher Utilities ────────────────────────────────────────

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
}

async function leetcodeGraphQL(query: string, variables: Record<string, unknown>) {
    const response = await fetchWithTimeout(
        LEETCODE_GRAPHQL_URL,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Referer": "https://leetcode.com",
                "Origin": "https://leetcode.com",
                "User-Agent": "Mozilla/5.0 (compatible; UniPathEngine/1.0)",
            },
            body: JSON.stringify({ query, variables }),
        },
        REQUEST_TIMEOUT_MS
    );

    if (!response.ok) {
        throw new Error(`LeetCode GraphQL HTTP ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
        const errMsg = json.errors[0]?.message ?? "Unknown GraphQL error";
        throw new Error(`LeetCode GraphQL error: ${errMsg}`);
    }

    return json.data;
}

// ─── Alfa API Fallback ────────────────────────────────────────
// Self-host alfa-leetcode-api on Railway: https://github.com/alfaarghya/alfa-leetcode-api
// Free tier, stable, resolves LeetCode CORS/IP blocking issues.

async function fetchFromAlfaApi(username: string): Promise<LeetCodeRawProfile> {
    const [profileRes, calendarRes] = await Promise.all([
        fetchWithTimeout(`${ALFA_API_URL}/${username}`, { method: "GET" }, REQUEST_TIMEOUT_MS),
        fetchWithTimeout(`${ALFA_API_URL}/${username}/calendar`, { method: "GET" }, REQUEST_TIMEOUT_MS),
    ]);

    if (!profileRes.ok) {
        if (profileRes.status === 404) throw new Error("USER_NOT_FOUND");
        throw new Error(`Alfa API HTTP ${profileRes.status}`);
    }

    const profile = await profileRes.json();
    const calendar = calendarRes.ok ? await calendarRes.json() : {};

    // Normalize Alfa API response to our LeetCodeRawProfile shape
    return {
        username: profile.username ?? username,
        realName: profile.name ?? "",
        ranking: profile.ranking ?? 0,
        reputation: profile.reputation ?? 0,
        starRating: profile.starRating ?? 0,
        aboutMe: profile.aboutMe ?? "",
        avatar: profile.avatar ?? "",
        totalSolved: profile.totalSolved ?? 0,
        totalQuestions: profile.totalQuestions ?? 0,
        easySolved: profile.easySolved ?? 0,
        totalEasy: profile.totalEasy ?? 0,
        mediumSolved: profile.mediumSolved ?? 0,
        totalMedium: profile.totalMedium ?? 0,
        hardSolved: profile.hardSolved ?? 0,
        totalHard: profile.totalHard ?? 0,
        acceptanceRate: profile.acceptanceRate ?? 0,
        contributionPoints: profile.contributionPoints ?? 0,
        streak: calendar.streak ?? profile.streak ?? 0,
        totalActiveDays: calendar.totalActiveDays ?? 0,
        submissionCalendar: JSON.parse(calendar.submissionCalendar ?? "{}"),
        tagProblemCounts: {
            advanced: profile.advancedTagProblemCounts ?? [],
            intermediate: profile.intermediateTagProblemCounts ?? [],
            fundamental: profile.fundamentalTagProblemCounts ?? [],
        },
        recentSubmissions: profile.recentAcSubmissionList ?? [],
        badges: profile.badges ?? [],
    };
}

// ─── Primary Fetcher (GraphQL → Alfa fallback) ────────────────

export interface FetchResult {
    profile: LeetCodeRawProfile;
    source: "leetcode-graphql" | "alfa-api";
}

export async function fetchLeetCodeProfile(username: string): Promise<FetchResult> {
    // Validate username
    if (!/^[a-zA-Z0-9_-]{2,30}$/.test(username)) {
        throw new Error("INVALID_USERNAME");
    }

    // Strategy 1: Direct LeetCode GraphQL
    try {
        const [profileData, calendarData, recentData] = await Promise.all([
            leetcodeGraphQL(USER_PROFILE_QUERY, { username }),
            leetcodeGraphQL(USER_CALENDAR_QUERY, { username, year: new Date().getFullYear() }),
            leetcodeGraphQL(RECENT_SUBMISSIONS_QUERY, { username, limit: 20 }),
        ]);

        const user = profileData?.matchedUser;
        const cal = calendarData?.matchedUser?.userCalendar;
        const recents = recentData?.recentAcSubmissionList ?? [];

        if (!user) throw new Error("USER_NOT_FOUND");

        // Parse submission counts
        const acSubmissions = user.submitStats?.acSubmissionNum ?? [];
        const getCount = (diff: string) =>
            acSubmissions.find((s: any) => s.difficulty === diff)?.count ?? 0;

        const profile: LeetCodeRawProfile = {
            username: user.username,
            realName: user.profile?.realName ?? "",
            ranking: user.profile?.ranking ?? 0,
            reputation: user.profile?.reputation ?? 0,
            starRating: user.profile?.starRating ?? 0,
            aboutMe: user.profile?.aboutMe ?? "",
            avatar: user.profile?.userAvatar ?? "",
            totalSolved: getCount("All"),
            totalQuestions: 0,
            easySolved: getCount("Easy"),
            totalEasy: 0,
            mediumSolved: getCount("Medium"),
            totalMedium: 0,
            hardSolved: getCount("Hard"),
            totalHard: 0,
            acceptanceRate: 0,
            contributionPoints: 0,
            streak: cal?.streak ?? 0,
            totalActiveDays: cal?.totalActiveDays ?? 0,
            submissionCalendar: JSON.parse(cal?.submissionCalendar ?? "{}"),
            tagProblemCounts: user.tagProblemCounts ?? { advanced: [], intermediate: [], fundamental: [] },
            recentSubmissions: recents as RecentSubmission[],
            badges: user.badges ?? [],
        };

        return { profile, source: "leetcode-graphql" };

    } catch (err: any) {
        // Known non-recoverable errors — don't try fallback
        if (err.message === "USER_NOT_FOUND" || err.message === "INVALID_USERNAME") {
            throw err;
        }

        console.warn(`[FANGEngine] LeetCode GraphQL failed (${err.message}), trying Alfa API fallback...`);
    }

    // Strategy 2: Alfa API fallback
    try {
        const profile = await fetchFromAlfaApi(username);
        return { profile, source: "alfa-api" };
    } catch (err: any) {
        if (err.message === "USER_NOT_FOUND") throw err;
        throw new Error("FETCH_FAILED");
    }
}
