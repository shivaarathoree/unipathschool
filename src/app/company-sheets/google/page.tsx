"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProFeatureGate from "@/components/ProFeatureGate";
import { motion } from "framer-motion";

type Difficulty = "Easy" | "Medium" | "Hard";
type Category =
    | "Arrays"
    | "Sorting"
    | "Binary Search"
    | "Linked List"
    | "Stack & Queue"
    | "Hashing"
    | "Backtracking"
    | "Trees"
    | "Dynamic Programming"
    | "Graphs"
    | "Strings"
    | "Math"
    | "Trie"
    | "Heap"
    | "Design";

interface Question {
    id: number;
    title: string;
    difficulty: Difficulty;
    category: Category;
    link: string;
}

const questions: Question[] = [
    { id: 1, title: "Two Sum", difficulty: "Easy", category: "Arrays", link: "https://leetcode.com/problems/two-sum/" },
    { id: 2, title: "Largest Contiguous Sum", difficulty: "Easy", category: "Arrays", link: "https://leetcode.com/problems/maximum-subarray/" },
    { id: 3, title: "Pascal's Triangle", difficulty: "Easy", category: "Arrays", link: "https://leetcode.com/problems/pascals-triangle/" },
    { id: 4, title: "Matrix Rotation", difficulty: "Medium", category: "Arrays", link: "https://leetcode.com/problems/rotate-image/" },
    { id: 5, title: "Merge Overlapping Intervals", difficulty: "Medium", category: "Arrays", link: "https://leetcode.com/problems/merge-intervals/" },
    { id: 6, title: "Matrix Search", difficulty: "Medium", category: "Binary Search", link: "https://leetcode.com/problems/search-a-2d-matrix/" },
    { id: 7, title: "Search Rotated Sorted Array", difficulty: "Medium", category: "Binary Search", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
    { id: 8, title: "Unique Elements in Sorted Array", difficulty: "Easy", category: "Arrays", link: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
    { id: 9, title: "Sorted Arrays Intersection", difficulty: "Easy", category: "Arrays", link: "https://leetcode.com/problems/intersection-of-two-arrays-ii/" },
    { id: 10, title: "Insertion Sort Linked List", difficulty: "Medium", category: "Linked List", link: "https://leetcode.com/problems/insertion-sort-list/" },
    { id: 11, title: "Merge Sort Linked List", difficulty: "Medium", category: "Linked List", link: "https://leetcode.com/problems/sort-list/" },
    { id: 12, title: "Balanced Parentheses", difficulty: "Easy", category: "Stack & Queue", link: "https://leetcode.com/problems/valid-parentheses/" },
    { id: 13, title: "Largest Rectangle in Histogram", difficulty: "Hard", category: "Stack & Queue", link: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
    { id: 14, title: "Next Greater Element", difficulty: "Medium", category: "Stack & Queue", link: "https://leetcode.com/problems/next-greater-element-i/" },
    { id: 15, title: "Sliding Window Maximum", difficulty: "Hard", category: "Stack & Queue", link: "https://leetcode.com/problems/sliding-window-maximum/" },
    { id: 16, title: "LRU Cache", difficulty: "Hard", category: "Design", link: "https://leetcode.com/problems/lru-cache/" },
    { id: 17, title: "Longest Substring Without Repeat", difficulty: "Medium", category: "Hashing", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
    { id: 18, title: "Four Sum", difficulty: "Medium", category: "Arrays", link: "https://leetcode.com/problems/4sum/" },
    { id: 19, title: "Longest Substring with K Unique Characters", difficulty: "Medium", category: "Hashing", link: "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/" },
    { id: 20, title: "N Queens Problem", difficulty: "Hard", category: "Backtracking", link: "https://leetcode.com/problems/n-queens/" },
    { id: 21, title: "Subset Sum", difficulty: "Medium", category: "Dynamic Programming", link: "https://leetcode.com/problems/partition-equal-subset-sum/" },
    { id: 22, title: "Word Break", difficulty: "Medium", category: "Dynamic Programming", link: "https://leetcode.com/problems/word-break/" },
    { id: 23, title: "Palindrome Partitioning", difficulty: "Medium", category: "Backtracking", link: "https://leetcode.com/problems/palindrome-partitioning/" },
    { id: 24, title: "Generate Parentheses", difficulty: "Medium", category: "Backtracking", link: "https://leetcode.com/problems/generate-parentheses/" },
    { id: 25, title: "Sudoku Solver", difficulty: "Hard", category: "Backtracking", link: "https://leetcode.com/problems/sudoku-solver/" },
    { id: 26, title: "Invert Binary Tree", difficulty: "Easy", category: "Trees", link: "https://leetcode.com/problems/invert-binary-tree/" },
    { id: 27, title: "Median From Data Stream", difficulty: "Hard", category: "Heap", link: "https://leetcode.com/problems/find-median-from-data-stream/" },
    { id: 28, title: "Two Sum in BST", difficulty: "Easy", category: "Trees", link: "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/" },
    { id: 29, title: "Kth Smallest in BST", difficulty: "Medium", category: "Trees", link: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
    { id: 30, title: "Exponentiation With Modulus", difficulty: "Medium", category: "Math", link: "https://leetcode.com/problems/powx-n/" },
    { id: 31, title: "Longest Common Subsequence (LCS)", difficulty: "Medium", category: "Dynamic Programming", link: "https://leetcode.com/problems/longest-common-subsequence/" },
    { id: 32, title: "Edit Distance", difficulty: "Medium", category: "Dynamic Programming", link: "https://leetcode.com/problems/edit-distance/" },
    { id: 33, title: "Rod Cutting", difficulty: "Medium", category: "Dynamic Programming", link: "https://leetcode.com/problems/rod-cutting/" },
    { id: 34, title: "Minimum Egg Drops", difficulty: "Hard", category: "Dynamic Programming", link: "https://leetcode.com/problems/super-egg-drop/" },
    { id: 35, title: "Palindrome Partitioning 2", difficulty: "Hard", category: "Dynamic Programming", link: "https://leetcode.com/problems/palindrome-partitioning-ii/" },
    { id: 36, title: "Maximum Sum Increasing Subsequence", difficulty: "Medium", category: "Dynamic Programming", link: "https://leetcode.com/problems/maximum-sum-increasing-subsequence/" },
    { id: 37, title: "Unique Paths", difficulty: "Medium", category: "Dynamic Programming", link: "https://leetcode.com/problems/unique-paths/" },
    { id: 38, title: "Best Time to Buy and Sell Stocks", difficulty: "Easy", category: "Dynamic Programming", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
    { id: 39, title: "Best Time to Buy and Sell Stock IV", difficulty: "Hard", category: "Dynamic Programming", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/" },
    { id: 40, title: "Longest Palindromic Substring", difficulty: "Medium", category: "Dynamic Programming", link: "https://leetcode.com/problems/longest-palindromic-substring/" },
    { id: 41, title: "Word Break II", difficulty: "Hard", category: "Dynamic Programming", link: "https://leetcode.com/problems/word-break-ii/" },
    { id: 42, title: "Wildcard Matching", difficulty: "Hard", category: "Dynamic Programming", link: "https://leetcode.com/problems/wildcard-matching/" },
    { id: 43, title: "Number of Islands", difficulty: "Medium", category: "Graphs", link: "https://leetcode.com/problems/number-of-islands/" },
    { id: 44, title: "Capture Surrounded Regions", difficulty: "Medium", category: "Graphs", link: "https://leetcode.com/problems/surrounded-regions/" },
    { id: 45, title: "Word Ladder", difficulty: "Hard", category: "Graphs", link: "https://leetcode.com/problems/word-ladder/" },
    { id: 46, title: "Valid Course Schedule", difficulty: "Medium", category: "Graphs", link: "https://leetcode.com/problems/course-schedule/" },
    { id: 47, title: "Flood Fill Image", difficulty: "Easy", category: "Graphs", link: "https://leetcode.com/problems/flood-fill/" },
    { id: 48, title: "Clone a Graph", difficulty: "Medium", category: "Graphs", link: "https://leetcode.com/problems/clone-graph/" },
    { id: 49, title: "Longest Common Prefix", difficulty: "Easy", category: "Strings", link: "https://leetcode.com/problems/longest-common-prefix/" },
    { id: 50, title: "Substring Search II", difficulty: "Hard", category: "Strings", link: "https://leetcode.com/problems/implement-strstr/" },
    { id: 51, title: "Shortest Unique Prefix", difficulty: "Hard", category: "Trie", link: "https://leetcode.com/problems/shortest-unique-prefix/" },
    { id: 52, title: "Restaurant Reviews", difficulty: "Hard", category: "Design", link: "https://leetcode.com/problems/design-a-food-rating-system/" },
];

const DIFFICULTIES: ("All" | Difficulty)[] = ["All", "Easy", "Medium", "Hard"];
const CATEGORIES: ("All" | Category)[] = [
    "All", "Arrays", "Binary Search", "Linked List", "Stack & Queue",
    "Hashing", "Backtracking", "Trees", "Dynamic Programming", "Graphs",
    "Strings", "Math", "Trie", "Heap", "Design",
];

const difficultyConfig: Record<Difficulty, { label: string; bg: string; text: string; border: string }> = {
    Easy: { label: "Easy", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
    Medium: { label: "Medium", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
    Hard: { label: "Hard", bg: "bg-red-50", text: "text-red-500", border: "border-red-200" },
};

const categoryConfig: Record<Category, { color: string; bg: string }> = {
    "Arrays": { color: "text-indigo-600", bg: "bg-indigo-50" },
    "Sorting": { color: "text-violet-600", bg: "bg-violet-50" },
    "Binary Search": { color: "text-sky-600", bg: "bg-sky-50" },
    "Linked List": { color: "text-emerald-600", bg: "bg-emerald-50" },
    "Stack & Queue": { color: "text-amber-600", bg: "bg-amber-50" },
    "Hashing": { color: "text-pink-600", bg: "bg-pink-50" },
    "Backtracking": { color: "text-orange-600", bg: "bg-orange-50" },
    "Trees": { color: "text-teal-600", bg: "bg-teal-50" },
    "Dynamic Programming": { color: "text-cyan-600", bg: "bg-cyan-50" },
    "Graphs": { color: "text-purple-600", bg: "bg-purple-50" },
    "Strings": { color: "text-rose-600", bg: "bg-rose-50" },
    "Math": { color: "text-blue-600", bg: "bg-blue-50" },
    "Trie": { color: "text-lime-600", bg: "bg-lime-50" },
    "Heap": { color: "text-fuchsia-600", bg: "bg-fuchsia-50" },
    "Design": { color: "text-slate-600", bg: "bg-slate-50" },
};

const COMPANY_PRIMARY = "#4285F4"; // Google Blue
const COMPANY_NAME = "Google";

export default function GoogleQuestionsPage() {
    const { user, profile, loading, isPro } = useAuth();
    const [search, setSearch] = useState("");
    const [diffFilter, setDiffFilter] = useState<"All" | Difficulty>("All");
    const [catFilter, setCatFilter] = useState<"All" | Category>("All");

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!user || !profile || !isPro) {
        return <ProFeatureGate title="Google Interview Sheet" />;
    }

    const filtered = useMemo(() => {
        return questions.filter((q) => {
            const matchSearch = q.title.toLowerCase().includes(search.toLowerCase());
            const matchDiff = diffFilter === "All" || q.difficulty === diffFilter;
            const matchCat = catFilter === "All" || q.category === catFilter;
            return matchSearch && matchDiff && matchCat;
        });
    }, [search, diffFilter, catFilter]);

    const stats = useMemo(() => ({
        easy: questions.filter((q) => q.difficulty === "Easy").length,
        medium: questions.filter((q) => q.difficulty === "Medium").length,
        hard: questions.filter((q) => q.difficulty === "Hard").length,
    }), []);

    return (
        <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden">
            {/* Subtle grid background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0"></div>

            <Header />

            <main className="flex-grow max-w-6xl mx-auto w-full px-6 pt-32 pb-20 relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    {/* Back link */}
                    <a
                        href="/company-sheets"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors mb-8 group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Company Sheets
                    </a>

                    <div className="flex items-center gap-5 mb-6">
                        {/* Company Logo */}
                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-md">
                            <svg className="w-9 h-9" viewBox="0 0 48 48" fill="none">
                                <path d="M24 9.5C16.5 9.5 10.5 15.5 10.5 23C10.5 30.5 16.5 36.5 24 36.5C31.5 36.5 37.5 30.5 37.5 23C37.5 15.5 31.5 9.5 24 9.5Z" fill="#FFC107" stroke="#FFC107" strokeWidth="0.5" />
                                <path d="M24 9.5C16.5 9.5 10.5 15.5 10.5 23C10.5 30.5 16.5 36.5 24 36.5C31.5 36.5 37.5 30.5 37.5 23C37.5 15.5 31.5 9.5 24 9.5Z" fill="url(#googleGradient)" stroke="#FFC107" strokeWidth="0.5" />
                                <defs>
                                    <linearGradient id="googleGradient" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#4285F4" />
                                        <stop offset="33%" stopColor="#EA4335" />
                                        <stop offset="66%" stopColor="#FBBC05" />
                                        <stop offset="100%" stopColor="#34A853" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-6xl font-medium font-heading tracking-tighter text-slate-900">
                                {COMPANY_NAME} <span className="text-primary">Questions.</span>
                            </h1>
                            <p className="text-lg text-slate-500 font-light mt-2">
                                {questions.length} curated problems to ace your next {COMPANY_NAME} interview
                            </p>
                        </div>
                    </div>

                    {/* Stats Pills */}
                    <div className="flex gap-3 flex-wrap">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-slate-600 text-xs font-mono font-medium">
                            ⬡ {questions.length} total
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 text-xs font-mono font-medium">
                            ✓ {stats.easy} easy
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-200 bg-amber-50 text-amber-600 text-xs font-mono font-medium">
                            ◆ {stats.medium} medium
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 bg-red-50 text-red-500 text-xs font-mono font-medium">
                            ▲ {stats.hard} hard
                        </span>
                    </div>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-10 flex flex-col gap-5"
                >
                    {/* Search Bar */}
                    <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                        </svg>
                        <input
                            className="w-full py-3.5 px-4 pl-12 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-sans placeholder:text-slate-400 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
                            placeholder="Search questions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-2 flex-wrap items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Difficulty</span>
                        {DIFFICULTIES.map((d) => {
                            const isActive = diffFilter === d;
                            let activeClasses = "";
                            if (isActive) {
                                if (d === "All") activeClasses = "bg-primary/10 border-primary/30 text-primary";
                                else if (d === "Easy") activeClasses = "bg-emerald-50 border-emerald-300 text-emerald-600";
                                else if (d === "Medium") activeClasses = "bg-amber-50 border-amber-300 text-amber-600";
                                else if (d === "Hard") activeClasses = "bg-red-50 border-red-300 text-red-500";
                            }
                            return (
                                <button
                                    key={d}
                                    className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${isActive
                                        ? activeClasses
                                        : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 bg-white"
                                        }`}
                                    onClick={() => setDiffFilter(d)}
                                >
                                    {d}
                                </button>
                            );
                        })}

                        <div className="w-px h-5 bg-slate-200 mx-2" />

                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Topic</span>
                        {CATEGORIES.map((c) => {
                            const isActive = catFilter === c;
                            return (
                                <button
                                    key={c}
                                    className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${isActive
                                        ? "bg-primary/10 border-primary/30 text-primary"
                                        : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 bg-white"
                                        }`}
                                    onClick={() => setCatFilter(c)}
                                >
                                    {c}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Table Info Text */}
                <p className="text-xs text-primary/80 text-center mb-4 font-mono">
                    Click on &quot;View Problem&quot; to see full details on LeetCode
                </p>

                {/* Result Count */}
                <p className="text-xs font-mono text-slate-400 mb-4">
                    {filtered.length === questions.length
                        ? `Showing all ${questions.length} questions`
                        : `${filtered.length} of ${questions.length} questions`}
                </p>

                {/* Questions Table */}
                {filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 border border-slate-200 rounded-2xl bg-white shadow-sm"
                    >
                        <div className="text-4xl opacity-30 mb-3">◌</div>
                        <p className="text-sm text-slate-400">No questions match your filters</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/80">
                                        <th className="text-left py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-[70px]">#</th>
                                        <th className="text-left py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Title</th>
                                        <th className="text-left py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                        <th className="text-left py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Difficulty</th>
                                        <th className="text-right py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Link(s)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((q, idx) => {
                                        const cat = categoryConfig[q.category] || categoryConfig["Arrays"];
                                        const diff = difficultyConfig[q.difficulty];
                                        return (
                                            <tr
                                                key={q.id}
                                                className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors group"
                                            >
                                                <td className="py-4 px-6 text-sm font-mono text-slate-400 font-medium">
                                                    {idx + 1}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="font-heading font-medium text-slate-800 text-sm group-hover:text-primary transition-colors">
                                                        {q.title}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${cat.bg} ${cat.color}`}>
                                                        {q.category}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${diff.bg} ${diff.text} ${diff.border}`}>
                                                        {diff.label}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-end">
                                                        <a
                                                            href={q.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary/5 border border-primary/20 text-primary text-[11px] font-semibold hover:bg-primary/10 hover:border-primary/30 transition-all whitespace-nowrap"
                                                        >
                                                            View Problem
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </main>

            <Footer />
        </div>
    );
}
