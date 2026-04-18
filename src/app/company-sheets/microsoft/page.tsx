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
    | "Bit Manipulation";

interface Question {
    id: number;
    title: string;
    difficulty: Difficulty;
    category: Category;
    link: string;
}

const questions: Question[] = [
    { id: 1, title: "Two Sum", difficulty: "Easy", category: "Arrays", link: "https://leetcode.com/problems/two-sum/" },
    { id: 2, title: "Three Sum", difficulty: "Medium", category: "Arrays", link: "https://leetcode.com/problems/3sum/" },
    { id: 3, title: "Largest Contiguous Sum", difficulty: "Easy", category: "Arrays", link: "https://leetcode.com/problems/maximum-subarray/" },
    { id: 4, title: "Next Greater Permutation", difficulty: "Hard", category: "Arrays", link: "https://leetcode.com/problems/next-permutation/" },
    { id: 5, title: "Implement Insertion Sort", difficulty: "Easy", category: "Sorting", link: "https://leetcode.com/problems/sort-an-array/" },
    { id: 6, title: "Implement Merge Sort", difficulty: "Easy", category: "Sorting", link: "https://leetcode.com/problems/sort-an-array/" },
    { id: 7, title: "Implement Quicksort", difficulty: "Easy", category: "Sorting", link: "https://leetcode.com/problems/sort-an-array/" },
    { id: 8, title: "Inversion Count", difficulty: "Medium", category: "Sorting", link: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/" },
    { id: 9, title: "Square Root", difficulty: "Easy", category: "Binary Search", link: "https://leetcode.com/problems/sqrtx/" },
    { id: 10, title: "Search Rotated Sorted Array", difficulty: "Medium", category: "Binary Search", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
    { id: 11, title: "Kth element of two sorted lists", difficulty: "Medium", category: "Binary Search", link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
    { id: 12, title: "Dutch National Flag", difficulty: "Medium", category: "Arrays", link: "https://leetcode.com/problems/sort-colors/" },
    { id: 13, title: "Merge Two Sorted Arrays", difficulty: "Easy", category: "Arrays", link: "https://leetcode.com/problems/merge-sorted-array/" },
    { id: 14, title: "Trapping Rain Water", difficulty: "Hard", category: "Arrays", link: "https://leetcode.com/problems/trapping-rain-water/" },
    { id: 15, title: "Unique Elements in Sorted Array", difficulty: "Easy", category: "Arrays", link: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
    { id: 16, title: "Intersection of Two Linked Lists", difficulty: "Easy", category: "Linked List", link: "https://leetcode.com/problems/intersection-of-two-linked-lists/" },
    { id: 17, title: "Clone List with Random Pointer", difficulty: "Medium", category: "Linked List", link: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
    { id: 18, title: "Reverse a Linked List", difficulty: "Easy", category: "Linked List", link: "https://leetcode.com/problems/reverse-linked-list/" },
    { id: 19, title: "Middle Element of Linked List", difficulty: "Easy", category: "Linked List", link: "https://leetcode.com/problems/middle-of-the-linked-list/" },
    { id: 20, title: "Merge Two Sorted Linked List", difficulty: "Easy", category: "Linked List", link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
    { id: 21, title: "Delete Xth Node From End", difficulty: "Medium", category: "Linked List", link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
    { id: 22, title: "Add Two Numbers as Lists", difficulty: "Medium", category: "Linked List", link: "https://leetcode.com/problems/add-two-numbers/" },
    { id: 23, title: "Linked List Palindrome", difficulty: "Easy", category: "Linked List", link: "https://leetcode.com/problems/palindrome-linked-list/" },
    { id: 24, title: "Remove Loop From Linked List", difficulty: "Medium", category: "Linked List", link: "https://leetcode.com/problems/linked-list-cycle-ii/" },
    { id: 25, title: "Rotate a Linked List", difficulty: "Medium", category: "Linked List", link: "https://leetcode.com/problems/rotate-list/" },
    { id: 26, title: "Flatten a Multi-Level Linked List", difficulty: "Medium", category: "Linked List", link: "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/" },
    { id: 27, title: "Remove Duplicates from Sorted Linked List", difficulty: "Easy", category: "Linked List", link: "https://leetcode.com/problems/remove-duplicates-from-sorted-list/" },
    { id: 28, title: "Remove Duplicates from Sorted Linked List II", difficulty: "Medium", category: "Linked List", link: "https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/" },
    { id: 29, title: "Reverse a Linked List II", difficulty: "Medium", category: "Linked List", link: "https://leetcode.com/problems/reverse-linked-list-ii/" },
    { id: 30, title: "Reverse a Linked List in k-groups", difficulty: "Hard", category: "Linked List", link: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
    { id: 31, title: "Reorder List", difficulty: "Medium", category: "Linked List", link: "https://leetcode.com/problems/reorder-list/" },
    { id: 32, title: "Partition List", difficulty: "Medium", category: "Linked List", link: "https://leetcode.com/problems/partition-list/" },
    { id: 33, title: "Insertion Sort Linked List", difficulty: "Medium", category: "Linked List", link: "https://leetcode.com/problems/insertion-sort-list/" },
    { id: 34, title: "Implement Stack using Linked List", difficulty: "Easy", category: "Linked List", link: "https://leetcode.com/problems/design-linked-list/" },
    { id: 35, title: "Implement Queue using Stacks", difficulty: "Easy", category: "Stack & Queue", link: "https://leetcode.com/problems/implement-queue-using-stacks/" },
    { id: 36, title: "Implement Stack using Queues", difficulty: "Easy", category: "Stack & Queue", link: "https://leetcode.com/problems/implement-stack-using-queues/" },
    { id: 37, title: "Implement Min Stack", difficulty: "Easy", category: "Stack & Queue", link: "https://leetcode.com/problems/min-stack/" },
    { id: 38, title: "Rotting Apples", difficulty: "Medium", category: "Stack & Queue", link: "https://leetcode.com/problems/rotting-oranges/" },
    { id: 39, title: "Next Greater Element", difficulty: "Medium", category: "Stack & Queue", link: "https://leetcode.com/problems/next-greater-element-i/" },
    { id: 40, title: "Sliding Window Maximum", difficulty: "Hard", category: "Stack & Queue", link: "https://leetcode.com/problems/sliding-window-maximum/" },
    { id: 41, title: "LRU Cache", difficulty: "Hard", category: "Hashing", link: "https://leetcode.com/problems/lru-cache/" },
    { id: 42, title: "Longest Substring Without Repeat", difficulty: "Medium", category: "Hashing", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
    { id: 43, title: "Longest Subarray with Zero Sum", difficulty: "Medium", category: "Hashing", link: "https://leetcode.com/problems/continuous-subarray-sum/" },
    { id: 44, title: "Longest Consecutive Sequence", difficulty: "Medium", category: "Hashing", link: "https://leetcode.com/problems/longest-consecutive-sequence/" },
    { id: 45, title: "Distinct Numbers in Window", difficulty: "Medium", category: "Hashing", link: "https://leetcode.com/problems/sliding-window-maximum/" },
    { id: 46, title: "Four Sum", difficulty: "Medium", category: "Arrays", link: "https://leetcode.com/problems/4sum/" },
    { id: 47, title: "Rat In A Maze", difficulty: "Medium", category: "Backtracking", link: "https://leetcode.com/problems/unique-paths/" },
    { id: 48, title: "Combination Sum 2", difficulty: "Medium", category: "Backtracking", link: "https://leetcode.com/problems/combination-sum-ii/" },
    { id: 49, title: "Word Break", difficulty: "Medium", category: "Dynamic Programming", link: "https://leetcode.com/problems/word-break/" },
    { id: 50, title: "Palindrome Partitioning", difficulty: "Medium", category: "Backtracking", link: "https://leetcode.com/problems/palindrome-partitioning/" },
    { id: 51, title: "Subsets II", difficulty: "Medium", category: "Backtracking", link: "https://leetcode.com/problems/subsets-ii/" },
    { id: 52, title: "Letter Combinations of Phone Number", difficulty: "Medium", category: "Backtracking", link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
    { id: 53, title: "Generate Parentheses", difficulty: "Medium", category: "Backtracking", link: "https://leetcode.com/problems/generate-parentheses/" },
    { id: 54, title: "Restore IP Addresses", difficulty: "Medium", category: "Backtracking", link: "https://leetcode.com/problems/restore-ip-addresses/" },
    { id: 55, title: "Subsets", difficulty: "Medium", category: "Backtracking", link: "https://leetcode.com/problems/subsets/" },
    { id: 56, title: "Sudoku Solver", difficulty: "Hard", category: "Backtracking", link: "https://leetcode.com/problems/sudoku-solver/" },
    { id: 57, title: "Level Order Binary Tree", difficulty: "Easy", category: "Trees", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
    { id: 58, title: "Symmetric Binary Tree", difficulty: "Easy", category: "Trees", link: "https://leetcode.com/problems/symmetric-tree/" },
    { id: 59, title: "Maximum Path Sum", difficulty: "Hard", category: "Trees", link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
    { id: 60, title: "Lowest Common Ancestor", difficulty: "Medium", category: "Trees", link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
    { id: 61, title: "Balanced Binary Tree", difficulty: "Easy", category: "Trees", link: "https://leetcode.com/problems/balanced-binary-tree/" },
    { id: 62, title: "Zigzag Traversal", difficulty: "Medium", category: "Trees", link: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/" },
    { id: 63, title: "Top View", difficulty: "Medium", category: "Trees", link: "https://leetcode.com/problems/binary-tree-right-side-view/" },
    { id: 64, title: "Left View", difficulty: "Medium", category: "Trees", link: "https://leetcode.com/problems/binary-tree-right-side-view/" },
    { id: 65, title: "Binary Tree to DLL", difficulty: "Hard", category: "Trees", link: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/" },
    { id: 66, title: "Binary Tree Inorder", difficulty: "Easy", category: "Trees", link: "https://leetcode.com/problems/binary-tree-inorder-traversal/" },
    { id: 67, title: "Binary Tree Preorder", difficulty: "Easy", category: "Trees", link: "https://leetcode.com/problems/binary-tree-preorder-traversal/" },
    { id: 68, title: "Binary Tree Postorder", difficulty: "Easy", category: "Trees", link: "https://leetcode.com/problems/binary-tree-postorder-traversal/" },
    { id: 69, title: "Max Depth", difficulty: "Easy", category: "Trees", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
    { id: 70, title: "Diameter", difficulty: "Easy", category: "Trees", link: "https://leetcode.com/problems/diameter-of-binary-tree/" },
    { id: 71, title: "Construct Tree Pre+In", difficulty: "Medium", category: "Trees", link: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
    { id: 72, title: "Construct Tree In+Post", difficulty: "Medium", category: "Trees", link: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/" },
    { id: 73, title: "Flatten Binary Tree", difficulty: "Medium", category: "Trees", link: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/" },
    { id: 74, title: "Populate Next Right", difficulty: "Medium", category: "Trees", link: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/" },
    { id: 75, title: "Invert Binary Tree", difficulty: "Easy", category: "Trees", link: "https://leetcode.com/problems/invert-binary-tree/" },
    { id: 76, title: "Merge K Sorted Arrays", difficulty: "Hard", category: "Sorting", link: "https://leetcode.com/problems/merge-k-sorted-lists/" },
    { id: 77, title: "Two Sum in BST", difficulty: "Easy", category: "Trees", link: "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/" },
    { id: 78, title: "Kth Largest in BST", difficulty: "Medium", category: "Trees", link: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
    { id: 79, title: "Inorder Successor", difficulty: "Medium", category: "Trees", link: "https://leetcode.com/problems/inorder-successor-in-bst/" },
    { id: 80, title: "Lowest Common Ancestor BST", difficulty: "Easy", category: "Trees", link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
    { id: 81, title: "Maximum Product Subarray", difficulty: "Medium", category: "Dynamic Programming", link: "https://leetcode.com/problems/maximum-product-subarray/" },
    { id: 82, title: "LIS", difficulty: "Medium", category: "Dynamic Programming", link: "https://leetcode.com/problems/longest-increasing-subsequence/" },
    { id: 83, title: "Coin Change", difficulty: "Medium", category: "Dynamic Programming", link: "https://leetcode.com/problems/coin-change/" },
    { id: 84, title: "Climbing Stairs", difficulty: "Easy", category: "Dynamic Programming", link: "https://leetcode.com/problems/climbing-stairs/" },
    { id: 85, title: "Best Time to Buy Sell", difficulty: "Easy", category: "Dynamic Programming", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
    { id: 86, title: "Longest Palindromic Substring", difficulty: "Medium", category: "Dynamic Programming", link: "https://leetcode.com/problems/longest-palindromic-substring/" },
    { id: 87, title: "Regex Matching", difficulty: "Hard", category: "Dynamic Programming", link: "https://leetcode.com/problems/regular-expression-matching/" },
    { id: 88, title: "Wildcard Matching", difficulty: "Hard", category: "Dynamic Programming", link: "https://leetcode.com/problems/wildcard-matching/" },
    { id: 89, title: "Number of Islands", difficulty: "Medium", category: "Graphs", link: "https://leetcode.com/problems/number-of-islands/" },
    { id: 90, title: "Detect Cycle Directed Graph", difficulty: "Medium", category: "Graphs", link: "https://leetcode.com/problems/course-schedule/" },
    { id: 91, title: "DFS Graph", difficulty: "Medium", category: "Graphs", link: "https://leetcode.com/problems/course-schedule/" },
    { id: 92, title: "Reverse Words", difficulty: "Medium", category: "Strings", link: "https://leetcode.com/problems/reverse-words-in-a-string/" },
    { id: 93, title: "Matrix Paths", difficulty: "Medium", category: "Dynamic Programming", link: "https://leetcode.com/problems/unique-paths/" },
    { id: 94, title: "Repeat Missing Number", difficulty: "Medium", category: "Arrays", link: "https://leetcode.com/problems/set-mismatch/" },
    { id: 95, title: "Divide Without Operators", difficulty: "Medium", category: "Math", link: "https://leetcode.com/problems/divide-two-integers/" },
    { id: 96, title: "Most Significant Bit", difficulty: "Easy", category: "Bit Manipulation", link: "https://leetcode.com/problems/number-of-1-bits/" },
];

const CATEGORIES: ("All" | Category)[] = [
    "All", "Arrays", "Sorting", "Binary Search", "Linked List",
    "Stack & Queue", "Hashing", "Backtracking", "Trees", "Dynamic Programming", "Graphs", "Strings", "Math", "Bit Manipulation",
];

const DIFFICULTIES: ("All" | Difficulty)[] = ["All", "Easy", "Medium", "Hard"];

const difficultyConfig: Record<Difficulty, { label: string; bg: string; text: string; border: string }> = {
    Easy: { label: "Easy", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
    Medium: { label: "Medium", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
    Hard: { label: "Hard", bg: "bg-red-50", text: "text-red-500", border: "border-red-200" },
};

const categoryConfig: Record<string, { color: string; bg: string }> = {
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
    "Bit Manipulation": { color: "text-indigo-600", bg: "bg-indigo-50" },
};

export default function MicrosoftQuestionsPage() {
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
        return <ProFeatureGate title="Microsoft Interview Sheet" />;
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
        <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col">
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
                        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/10">
                            <svg className="w-7 h-7" viewBox="0 0 23 23" fill="none">
                                <rect width="11" height="11" fill="#F25022" />
                                <rect x="12" width="11" height="11" fill="#7FBA00" />
                                <rect y="12" width="11" height="11" fill="#00A4EF" />
                                <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-6xl font-medium font-heading tracking-tighter text-slate-900">
                                Microsoft <span className="text-primary">Questions.</span>
                            </h1>
                            <p className="text-lg text-slate-500 font-light mt-2">
                                {questions.length} curated problems to ace your next Microsoft interview
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
