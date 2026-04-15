// ============================================================
// UNIPATH SCHOOL — FAANG Readiness Engine
// lib/engine/topicMapper.ts
// Maps raw LeetCode tag slugs → structured DSA phases
// ============================================================

import type { Phase, RecommendedProblem } from "../types";

export interface TopicConfig {
    displayName: string;
    phase: Phase;
    threshold: number;           // problems needed to be "strong"
    averageThreshold: number;    // problems needed to be "average"
    weight: number;              // importance in FAANG interviews (0–1)
    mustSolveProblems: RecommendedProblem[];
}

// Master topic configuration — every major LeetCode tag mapped
export const TOPIC_MAP: Record<string, TopicConfig> = {

    // ── FOUNDATION ──────────────────────────────────────────────

    "array": {
        displayName: "Arrays",
        phase: "Foundation",
        threshold: 50,
        averageThreshold: 25,
        weight: 0.95,
        mustSolveProblems: [
            { id: 1, title: "Two Sum", titleSlug: "two-sum", difficulty: "Easy", topic: "Arrays", frequency: 0.97, isTopInterview: true, companies: ["Google", "Amazon", "Meta"], leetcodeUrl: "https://leetcode.com/problems/two-sum/" },
            { id: 238, title: "Product of Array Except Self", titleSlug: "product-of-array-except-self", difficulty: "Medium", topic: "Arrays", frequency: 0.89, isTopInterview: true, companies: ["Amazon", "Apple"], leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/" },
            { id: 53, title: "Maximum Subarray", titleSlug: "maximum-subarray", difficulty: "Medium", topic: "Arrays", frequency: 0.86, isTopInterview: true, companies: ["Amazon", "Microsoft"], leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/" },
            { id: 33, title: "Search in Rotated Sorted Array", titleSlug: "search-in-rotated-sorted-array", difficulty: "Medium", topic: "Arrays", frequency: 0.78, isTopInterview: true, companies: ["Google", "Meta"], leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
            { id: 56, title: "Merge Intervals", titleSlug: "merge-intervals", difficulty: "Medium", topic: "Arrays", frequency: 0.84, isTopInterview: true, companies: ["Google", "Meta", "Amazon"], leetcodeUrl: "https://leetcode.com/problems/merge-intervals/" },
        ],
    },

    "string": {
        displayName: "Strings",
        phase: "Foundation",
        threshold: 30,
        averageThreshold: 15,
        weight: 0.88,
        mustSolveProblems: [
            { id: 3, title: "Longest Substring Without Repeating Characters", titleSlug: "longest-substring-without-repeating-characters", difficulty: "Medium", topic: "Strings", frequency: 0.92, isTopInterview: true, companies: ["Amazon", "Adobe"], leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
            { id: 5, title: "Longest Palindromic Substring", titleSlug: "longest-palindromic-substring", difficulty: "Medium", topic: "Strings", frequency: 0.81, isTopInterview: true, companies: ["Amazon", "Microsoft"], leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/" },
            { id: 49, title: "Group Anagrams", titleSlug: "group-anagrams", difficulty: "Medium", topic: "Strings", frequency: 0.79, isTopInterview: true, companies: ["Amazon", "Yahoo"], leetcodeUrl: "https://leetcode.com/problems/group-anagrams/" },
            { id: 76, title: "Minimum Window Substring", titleSlug: "minimum-window-substring", difficulty: "Hard", topic: "Strings", frequency: 0.72, isTopInterview: true, companies: ["Facebook", "Uber"], leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/" },
        ],
    },

    "hash-table": {
        displayName: "Hash Tables",
        phase: "Foundation",
        threshold: 25,
        averageThreshold: 12,
        weight: 0.85,
        mustSolveProblems: [
            { id: 146, title: "LRU Cache", titleSlug: "lru-cache", difficulty: "Medium", topic: "Hash Tables", frequency: 0.88, isTopInterview: true, companies: ["Amazon", "Google", "Meta"], leetcodeUrl: "https://leetcode.com/problems/lru-cache/" },
            { id: 380, title: "Insert Delete GetRandom O(1)", titleSlug: "insert-delete-getrandom-o1", difficulty: "Medium", topic: "Hash Tables", frequency: 0.74, isTopInterview: false, companies: ["Amazon"], leetcodeUrl: "https://leetcode.com/problems/insert-delete-getrandom-o1/" },
        ],
    },

    "two-pointers": {
        displayName: "Two Pointers",
        phase: "Foundation",
        threshold: 20,
        averageThreshold: 10,
        weight: 0.82,
        mustSolveProblems: [
            { id: 15, title: "3Sum", titleSlug: "3sum", difficulty: "Medium", topic: "Two Pointers", frequency: 0.88, isTopInterview: true, companies: ["Amazon", "Adobe"], leetcodeUrl: "https://leetcode.com/problems/3sum/" },
            { id: 42, title: "Trapping Rain Water", titleSlug: "trapping-rain-water", difficulty: "Hard", topic: "Two Pointers", frequency: 0.82, isTopInterview: true, companies: ["Amazon", "Google"], leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/" },
            { id: 11, title: "Container With Most Water", titleSlug: "container-with-most-water", difficulty: "Medium", topic: "Two Pointers", frequency: 0.85, isTopInterview: true, companies: ["Apple", "Bloomberg"], leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/" },
        ],
    },

    "sliding-window": {
        displayName: "Sliding Window",
        phase: "Foundation",
        threshold: 15,
        averageThreshold: 7,
        weight: 0.80,
        mustSolveProblems: [
            { id: 239, title: "Sliding Window Maximum", titleSlug: "sliding-window-maximum", difficulty: "Hard", topic: "Sliding Window", frequency: 0.76, isTopInterview: true, companies: ["Google", "Amazon"], leetcodeUrl: "https://leetcode.com/problems/sliding-window-maximum/" },
            { id: 424, title: "Longest Repeating Character Replacement", titleSlug: "longest-repeating-character-replacement", difficulty: "Medium", topic: "Sliding Window", frequency: 0.68, isTopInterview: false, companies: ["Google"], leetcodeUrl: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
        ],
    },

    // ── DATA STRUCTURES ──────────────────────────────────────────

    "tree": {
        displayName: "Trees",
        phase: "Data Structures",
        threshold: 30,
        averageThreshold: 15,
        weight: 0.92,
        mustSolveProblems: [
            { id: 104, title: "Maximum Depth of Binary Tree", titleSlug: "maximum-depth-of-binary-tree", difficulty: "Easy", topic: "Trees", frequency: 0.87, isTopInterview: true, companies: ["LinkedIn", "Uber"], leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
            { id: 226, title: "Invert Binary Tree", titleSlug: "invert-binary-tree", difficulty: "Easy", topic: "Trees", frequency: 0.78, isTopInterview: true, companies: ["Google", "Apple"], leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/" },
            { id: 235, title: "Lowest Common Ancestor of a BST", titleSlug: "lowest-common-ancestor-of-a-binary-search-tree", difficulty: "Medium", topic: "Trees", frequency: 0.82, isTopInterview: true, companies: ["Amazon", "Microsoft"], leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
            { id: 124, title: "Binary Tree Maximum Path Sum", titleSlug: "binary-tree-maximum-path-sum", difficulty: "Hard", topic: "Trees", frequency: 0.71, isTopInterview: true, companies: ["Google", "Meta"], leetcodeUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
            { id: 297, title: "Serialize and Deserialize Binary Tree", titleSlug: "serialize-and-deserialize-binary-tree", difficulty: "Hard", topic: "Trees", frequency: 0.69, isTopInterview: true, companies: ["Meta", "Google"], leetcodeUrl: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
        ],
    },

    "linked-list": {
        displayName: "Linked Lists",
        phase: "Data Structures",
        threshold: 20,
        averageThreshold: 10,
        weight: 0.83,
        mustSolveProblems: [
            { id: 206, title: "Reverse Linked List", titleSlug: "reverse-linked-list", difficulty: "Easy", topic: "Linked Lists", frequency: 0.90, isTopInterview: true, companies: ["Adobe", "Microsoft"], leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/" },
            { id: 21, title: "Merge Two Sorted Lists", titleSlug: "merge-two-sorted-lists", difficulty: "Easy", topic: "Linked Lists", frequency: 0.85, isTopInterview: true, companies: ["Amazon", "Google"], leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/" },
            { id: 23, title: "Merge K Sorted Lists", titleSlug: "merge-k-sorted-lists", difficulty: "Hard", topic: "Linked Lists", frequency: 0.77, isTopInterview: true, companies: ["Amazon", "Google"], leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/" },
            { id: 142, title: "Linked List Cycle II", titleSlug: "linked-list-cycle-ii", difficulty: "Medium", topic: "Linked Lists", frequency: 0.73, isTopInterview: true, companies: ["Amazon", "Microsoft"], leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle-ii/" },
        ],
    },

    "binary-search": {
        displayName: "Binary Search",
        phase: "Data Structures",
        threshold: 20,
        averageThreshold: 10,
        weight: 0.85,
        mustSolveProblems: [
            { id: 704, title: "Binary Search", titleSlug: "binary-search", difficulty: "Easy", topic: "Binary Search", frequency: 0.80, isTopInterview: true, companies: ["Google"], leetcodeUrl: "https://leetcode.com/problems/binary-search/" },
            { id: 4, title: "Median of Two Sorted Arrays", titleSlug: "median-of-two-sorted-arrays", difficulty: "Hard", topic: "Binary Search", frequency: 0.74, isTopInterview: true, companies: ["Google", "Amazon"], leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
            { id: 153, title: "Find Minimum in Rotated Sorted Array", titleSlug: "find-minimum-in-rotated-sorted-array", difficulty: "Medium", topic: "Binary Search", frequency: 0.76, isTopInterview: true, companies: ["Microsoft"], leetcodeUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
        ],
    },

    "stack": {
        displayName: "Stacks & Queues",
        phase: "Data Structures",
        threshold: 15,
        averageThreshold: 7,
        weight: 0.78,
        mustSolveProblems: [
            { id: 20, title: "Valid Parentheses", titleSlug: "valid-parentheses", difficulty: "Easy", topic: "Stacks & Queues", frequency: 0.89, isTopInterview: true, companies: ["Amazon", "Meta"], leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/" },
            { id: 84, title: "Largest Rectangle in Histogram", titleSlug: "largest-rectangle-in-histogram", difficulty: "Hard", topic: "Stacks & Queues", frequency: 0.68, isTopInterview: true, companies: ["Google", "Amazon"], leetcodeUrl: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
        ],
    },

    "heap": {
        displayName: "Heap / Priority Queue",
        phase: "Data Structures",
        threshold: 15,
        averageThreshold: 7,
        weight: 0.80,
        mustSolveProblems: [
            { id: 347, title: "Top K Frequent Elements", titleSlug: "top-k-frequent-elements", difficulty: "Medium", topic: "Heap / Priority Queue", frequency: 0.82, isTopInterview: true, companies: ["Amazon", "Google"], leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/" },
            { id: 295, title: "Find Median from Data Stream", titleSlug: "find-median-from-data-stream", difficulty: "Hard", topic: "Heap / Priority Queue", frequency: 0.73, isTopInterview: true, companies: ["Google", "Amazon"], leetcodeUrl: "https://leetcode.com/problems/find-median-from-data-stream/" },
        ],
    },

    // ── ALGORITHMS ───────────────────────────────────────────────

    "graph": {
        displayName: "Graphs",
        phase: "Algorithms",
        threshold: 20,
        averageThreshold: 8,
        weight: 0.94,
        mustSolveProblems: [
            { id: 200, title: "Number of Islands", titleSlug: "number-of-islands", difficulty: "Medium", topic: "Graphs", frequency: 0.93, isTopInterview: true, companies: ["Amazon", "Google", "Meta"], leetcodeUrl: "https://leetcode.com/problems/number-of-islands/" },
            { id: 133, title: "Clone Graph", titleSlug: "clone-graph", difficulty: "Medium", topic: "Graphs", frequency: 0.82, isTopInterview: true, companies: ["Meta", "Google"], leetcodeUrl: "https://leetcode.com/problems/clone-graph/" },
            { id: 207, title: "Course Schedule", titleSlug: "course-schedule", difficulty: "Medium", topic: "Graphs", frequency: 0.84, isTopInterview: true, companies: ["Airbnb", "Amazon"], leetcodeUrl: "https://leetcode.com/problems/course-schedule/" },
            { id: 417, title: "Pacific Atlantic Water Flow", titleSlug: "pacific-atlantic-water-flow", difficulty: "Medium", topic: "Graphs", frequency: 0.72, isTopInterview: true, companies: ["Google"], leetcodeUrl: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
            { id: 127, title: "Word Ladder", titleSlug: "word-ladder", difficulty: "Hard", topic: "Graphs", frequency: 0.69, isTopInterview: true, companies: ["Amazon", "LinkedIn"], leetcodeUrl: "https://leetcode.com/problems/word-ladder/" },
        ],
    },

    "depth-first-search": {
        displayName: "DFS",
        phase: "Algorithms",
        threshold: 15,
        averageThreshold: 7,
        weight: 0.88,
        mustSolveProblems: [
            { id: 543, title: "Diameter of Binary Tree", titleSlug: "diameter-of-binary-tree", difficulty: "Easy", topic: "DFS", frequency: 0.76, isTopInterview: true, companies: ["Amazon", "Google"], leetcodeUrl: "https://leetcode.com/problems/diameter-of-binary-tree/" },
            { id: 79, title: "Word Search", titleSlug: "word-search", difficulty: "Medium", topic: "DFS", frequency: 0.81, isTopInterview: true, companies: ["Amazon", "Microsoft"], leetcodeUrl: "https://leetcode.com/problems/word-search/" },
        ],
    },

    "breadth-first-search": {
        displayName: "BFS",
        phase: "Algorithms",
        threshold: 15,
        averageThreshold: 7,
        weight: 0.88,
        mustSolveProblems: [
            { id: 102, title: "Binary Tree Level Order Traversal", titleSlug: "binary-tree-level-order-traversal", difficulty: "Medium", topic: "BFS", frequency: 0.84, isTopInterview: true, companies: ["Amazon", "Microsoft"], leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
            { id: 994, title: "Rotting Oranges", titleSlug: "rotting-oranges", difficulty: "Medium", topic: "BFS", frequency: 0.78, isTopInterview: true, companies: ["Amazon", "DoorDash"], leetcodeUrl: "https://leetcode.com/problems/rotting-oranges/" },
        ],
    },

    "dynamic-programming": {
        displayName: "Dynamic Programming",
        phase: "Algorithms",
        threshold: 25,
        averageThreshold: 12,
        weight: 0.97,
        mustSolveProblems: [
            { id: 322, title: "Coin Change", titleSlug: "coin-change", difficulty: "Medium", topic: "Dynamic Programming", frequency: 0.91, isTopInterview: true, companies: ["Amazon", "Google", "Meta"], leetcodeUrl: "https://leetcode.com/problems/coin-change/" },
            { id: 300, title: "Longest Increasing Subsequence", titleSlug: "longest-increasing-subsequence", difficulty: "Medium", topic: "Dynamic Programming", frequency: 0.85, isTopInterview: true, companies: ["Google", "Microsoft"], leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/" },
            { id: 72, title: "Edit Distance", titleSlug: "edit-distance", difficulty: "Hard", topic: "Dynamic Programming", frequency: 0.78, isTopInterview: true, companies: ["Google", "Uber"], leetcodeUrl: "https://leetcode.com/problems/edit-distance/" },
            { id: 312, title: "Burst Balloons", titleSlug: "burst-balloons", difficulty: "Hard", topic: "Dynamic Programming", frequency: 0.65, isTopInterview: true, companies: ["Google"], leetcodeUrl: "https://leetcode.com/problems/burst-balloons/" },
            { id: 198, title: "House Robber", titleSlug: "house-robber", difficulty: "Medium", topic: "Dynamic Programming", frequency: 0.87, isTopInterview: true, companies: ["Amazon", "Cisco"], leetcodeUrl: "https://leetcode.com/problems/house-robber/" },
        ],
    },

    "greedy": {
        displayName: "Greedy",
        phase: "Algorithms",
        threshold: 15,
        averageThreshold: 7,
        weight: 0.82,
        mustSolveProblems: [
            { id: 55, title: "Jump Game", titleSlug: "jump-game", difficulty: "Medium", topic: "Greedy", frequency: 0.83, isTopInterview: true, companies: ["Amazon", "Microsoft"], leetcodeUrl: "https://leetcode.com/problems/jump-game/" },
            { id: 435, title: "Non-overlapping Intervals", titleSlug: "non-overlapping-intervals", difficulty: "Medium", topic: "Greedy", frequency: 0.74, isTopInterview: true, companies: ["Google"], leetcodeUrl: "https://leetcode.com/problems/non-overlapping-intervals/" },
        ],
    },

    "backtracking": {
        displayName: "Backtracking",
        phase: "Algorithms",
        threshold: 12,
        averageThreshold: 6,
        weight: 0.84,
        mustSolveProblems: [
            { id: 46, title: "Permutations", titleSlug: "permutations", difficulty: "Medium", topic: "Backtracking", frequency: 0.86, isTopInterview: true, companies: ["LinkedIn", "Microsoft"], leetcodeUrl: "https://leetcode.com/problems/permutations/" },
            { id: 51, title: "N-Queens", titleSlug: "n-queens", difficulty: "Hard", topic: "Backtracking", frequency: 0.72, isTopInterview: true, companies: ["Amazon", "Microsoft"], leetcodeUrl: "https://leetcode.com/problems/n-queens/" },
            { id: 39, title: "Combination Sum", titleSlug: "combination-sum", difficulty: "Medium", topic: "Backtracking", frequency: 0.82, isTopInterview: true, companies: ["Amazon", "Google"], leetcodeUrl: "https://leetcode.com/problems/combination-sum/" },
        ],
    },

    // ── ADVANCED ─────────────────────────────────────────────────

    "trie": {
        displayName: "Trie",
        phase: "Advanced",
        threshold: 8,
        averageThreshold: 4,
        weight: 0.79,
        mustSolveProblems: [
            { id: 208, title: "Implement Trie (Prefix Tree)", titleSlug: "implement-trie-prefix-tree", difficulty: "Medium", topic: "Trie", frequency: 0.80, isTopInterview: true, companies: ["Google", "Facebook"], leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
            { id: 212, title: "Word Search II", titleSlug: "word-search-ii", difficulty: "Hard", topic: "Trie", frequency: 0.69, isTopInterview: true, companies: ["Airbnb", "Google"], leetcodeUrl: "https://leetcode.com/problems/word-search-ii/" },
        ],
    },

    "union-find": {
        displayName: "Union Find",
        phase: "Advanced",
        threshold: 8,
        averageThreshold: 4,
        weight: 0.76,
        mustSolveProblems: [
            { id: 323, title: "Number of Connected Components in an Undirected Graph", titleSlug: "number-of-connected-components-in-an-undirected-graph", difficulty: "Medium", topic: "Union Find", frequency: 0.71, isTopInterview: true, companies: ["Google", "LinkedIn"], leetcodeUrl: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },
            { id: 305, title: "Number of Islands II", titleSlug: "number-of-islands-ii", difficulty: "Hard", topic: "Union Find", frequency: 0.65, isTopInterview: false, companies: ["Google"], leetcodeUrl: "https://leetcode.com/problems/number-of-islands-ii/" },
        ],
    },

    "bit-manipulation": {
        displayName: "Bit Manipulation",
        phase: "Advanced",
        threshold: 10,
        averageThreshold: 5,
        weight: 0.72,
        mustSolveProblems: [
            { id: 191, title: "Number of 1 Bits", titleSlug: "number-of-1-bits", difficulty: "Easy", topic: "Bit Manipulation", frequency: 0.75, isTopInterview: true, companies: ["Apple"], leetcodeUrl: "https://leetcode.com/problems/number-of-1-bits/" },
            { id: 268, title: "Missing Number", titleSlug: "missing-number", difficulty: "Easy", topic: "Bit Manipulation", frequency: 0.77, isTopInterview: true, companies: ["Microsoft", "Amazon"], leetcodeUrl: "https://leetcode.com/problems/missing-number/" },
        ],
    },

    "monotonic-stack": {
        displayName: "Monotonic Stack",
        phase: "Advanced",
        threshold: 8,
        averageThreshold: 4,
        weight: 0.74,
        mustSolveProblems: [
            { id: 739, title: "Daily Temperatures", titleSlug: "daily-temperatures", difficulty: "Medium", topic: "Monotonic Stack", frequency: 0.78, isTopInterview: true, companies: ["Amazon"], leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/" },
            { id: 901, title: "Online Stock Span", titleSlug: "online-stock-span", difficulty: "Medium", topic: "Monotonic Stack", frequency: 0.66, isTopInterview: false, companies: ["Google"], leetcodeUrl: "https://leetcode.com/problems/online-stock-span/" },
        ],
    },

    "topological-sort": {
        displayName: "Topological Sort",
        phase: "Advanced",
        threshold: 8,
        averageThreshold: 4,
        weight: 0.77,
        mustSolveProblems: [
            { id: 210, title: "Course Schedule II", titleSlug: "course-schedule-ii", difficulty: "Medium", topic: "Topological Sort", frequency: 0.79, isTopInterview: true, companies: ["Airbnb", "Amazon"], leetcodeUrl: "https://leetcode.com/problems/course-schedule-ii/" },
            { id: 269, title: "Alien Dictionary", titleSlug: "alien-dictionary", difficulty: "Hard", topic: "Topological Sort", frequency: 0.71, isTopInterview: true, companies: ["Google", "Meta"], leetcodeUrl: "https://leetcode.com/problems/alien-dictionary/" },
        ],
    },
};

// Alternate tag slugs LeetCode uses → canonical key in TOPIC_MAP
export const TAG_ALIASES: Record<string, string> = {
    "arrays": "array",
    "strings": "string",
    "hashing": "hash-table",
    "hash-map": "hash-table",
    "hashmap": "hash-table",
    "trees": "tree",
    "binary-tree": "tree",
    "binary-search-tree": "tree",
    "graphs": "graph",
    "dfs": "depth-first-search",
    "bfs": "breadth-first-search",
    "dp": "dynamic-programming",
    "linked-lists": "linked-list",
    "stacks": "stack",
    "queue": "stack",
    "queues": "stack",
    "heaps": "heap",
    "priority-queue": "heap",
    "tries": "trie",
    "disjoint-set": "union-find",
    "segment-tree": "topological-sort",
    "monotonic-queue": "monotonic-stack",
};

/**
 * Normalizes a raw LeetCode tag slug to our canonical topic key.
 * Returns null if not in our topic map (we ignore irrelevant tags).
 */
export function normalizeTag(rawSlug: string): string | null {
    const slug = rawSlug.toLowerCase().trim();
    if (TOPIC_MAP[slug]) return slug;
    if (TAG_ALIASES[slug]) return TAG_ALIASES[slug];
    return null;
}

/**
 * Returns all topics sorted by phase order then by weight descending.
 */
export function getTopicsInOrder(): Array<[string, TopicConfig]> {
    const phaseOrder: Record<Phase, number> = {
        "Foundation": 1,
        "Data Structures": 2,
        "Algorithms": 3,
        "Advanced": 4,
    };
    return Object.entries(TOPIC_MAP).sort(([, a], [, b]) => {
        const phaseDiff = phaseOrder[a.phase] - phaseOrder[b.phase];
        if (phaseDiff !== 0) return phaseDiff;
        return b.weight - a.weight;
    });
}
