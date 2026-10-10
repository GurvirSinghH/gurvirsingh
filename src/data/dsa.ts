/**
 * DSA section of the Learning page (/learning).
 *
 * The section shows live progress from the "Tracker" tab of a Google Sheet. To connect it, put the
 * sheet's ID in `sheetId` (the long code between /d/ and /edit in the sheet's address) and share
 * the sheet as "Anyone with the link: Viewer". The list below is the NeetCode 150 in study order;
 * it is shown when the sheet can't be read, and in the prerendered HTML before progress loads.
 */

export type Difficulty = "Easy" | "Medium" | "Hard";
export type DsaStatus = "Not started" | "Attempted" | "Solved" | "Re-solved";

export interface DsaProblem {
  topic: string;
  name: string;
  difficulty: Difficulty;
  status: DsaStatus;
  /** "YYYY-MM-DD", or null when not filled in. */
  solvedOn: string | null;
  resolvedOn: string | null;
  /** One-line key idea, in my own words. */
  note: string;
}

export const dsa = {
  // Google Sheet ID, e.g. "1AbC…xyz". While null, the page shows the list without progress.
  sheetId: "1dofSb9hs6jerN2briwY0TRuKz74LubQr9c-srPxxYS8" as string | null,
  // Name of the tab that holds the problems.
  sheetTab: "Tracker",
  // Day I started the list ("YYYY-MM-DD").
  startedOn: "2026-10-10",
  listName: "NeetCode 150",
  listUrl: "https://neetcode.io/practice",
};

function topic(name: string, problems: [string, Difficulty][]): DsaProblem[] {
  return problems.map(([problem, difficulty]) => ({
    topic: name,
    name: problem,
    difficulty,
    status: "Not started",
    solvedOn: null,
    resolvedOn: null,
    note: "",
  }));
}

export const baselineProblems: DsaProblem[] = [
  topic("Arrays & Hashing", [
    ["Contains Duplicate", "Easy"],
    ["Valid Anagram", "Easy"],
    ["Two Sum", "Easy"],
    ["Group Anagrams", "Medium"],
    ["Top K Frequent Elements", "Medium"],
    ["Encode and Decode Strings", "Medium"],
    ["Product of Array Except Self", "Medium"],
    ["Valid Sudoku", "Medium"],
    ["Longest Consecutive Sequence", "Medium"],
  ]),
  topic("Two Pointers", [
    ["Valid Palindrome", "Easy"],
    ["Two Sum II Input Array Is Sorted", "Medium"],
    ["3Sum", "Medium"],
    ["Container With Most Water", "Medium"],
    ["Trapping Rain Water", "Hard"],
  ]),
  topic("Sliding Window", [
    ["Best Time to Buy and Sell Stock", "Easy"],
    ["Longest Substring Without Repeating Characters", "Medium"],
    ["Longest Repeating Character Replacement", "Medium"],
    ["Permutation in String", "Medium"],
    ["Minimum Window Substring", "Hard"],
    ["Sliding Window Maximum", "Hard"],
  ]),
  topic("Stack", [
    ["Valid Parentheses", "Easy"],
    ["Min Stack", "Medium"],
    ["Evaluate Reverse Polish Notation", "Medium"],
    ["Generate Parentheses", "Medium"],
    ["Daily Temperatures", "Medium"],
    ["Car Fleet", "Medium"],
    ["Largest Rectangle in Histogram", "Hard"],
  ]),
  topic("Binary Search", [
    ["Binary Search", "Easy"],
    ["Search a 2D Matrix", "Medium"],
    ["Koko Eating Bananas", "Medium"],
    ["Find Minimum in Rotated Sorted Array", "Medium"],
    ["Search in Rotated Sorted Array", "Medium"],
    ["Time Based Key-Value Store", "Medium"],
    ["Median of Two Sorted Arrays", "Hard"],
  ]),
  topic("Linked List", [
    ["Reverse Linked List", "Easy"],
    ["Merge Two Sorted Lists", "Easy"],
    ["Linked List Cycle", "Easy"],
    ["Reorder List", "Medium"],
    ["Remove Nth Node From End of List", "Medium"],
    ["Copy List With Random Pointer", "Medium"],
    ["Add Two Numbers", "Medium"],
    ["Find the Duplicate Number", "Medium"],
    ["LRU Cache", "Medium"],
    ["Merge K Sorted Lists", "Hard"],
    ["Reverse Nodes in K-Group", "Hard"],
  ]),
  topic("Trees", [
    ["Invert Binary Tree", "Easy"],
    ["Maximum Depth of Binary Tree", "Easy"],
    ["Diameter of Binary Tree", "Easy"],
    ["Balanced Binary Tree", "Easy"],
    ["Same Tree", "Easy"],
    ["Subtree of Another Tree", "Easy"],
    ["Lowest Common Ancestor of a Binary Search Tree", "Medium"],
    ["Binary Tree Level Order Traversal", "Medium"],
    ["Binary Tree Right Side View", "Medium"],
    ["Count Good Nodes in Binary Tree", "Medium"],
    ["Validate Binary Search Tree", "Medium"],
    ["Kth Smallest Element in a BST", "Medium"],
    ["Construct Binary Tree from Preorder and Inorder Traversal", "Medium"],
    ["Binary Tree Maximum Path Sum", "Hard"],
    ["Serialize and Deserialize Binary Tree", "Hard"],
  ]),
  topic("Tries", [
    ["Implement Trie (Prefix Tree)", "Medium"],
    ["Design Add and Search Words Data Structure", "Medium"],
    ["Word Search II", "Hard"],
  ]),
  topic("Heap / Priority Queue", [
    ["Kth Largest Element in a Stream", "Easy"],
    ["Last Stone Weight", "Easy"],
    ["K Closest Points to Origin", "Medium"],
    ["Kth Largest Element in an Array", "Medium"],
    ["Task Scheduler", "Medium"],
    ["Design Twitter", "Medium"],
    ["Find Median from Data Stream", "Hard"],
  ]),
  topic("Backtracking", [
    ["Subsets", "Medium"],
    ["Combination Sum", "Medium"],
    ["Permutations", "Medium"],
    ["Subsets II", "Medium"],
    ["Combination Sum II", "Medium"],
    ["Word Search", "Medium"],
    ["Palindrome Partitioning", "Medium"],
    ["Letter Combinations of a Phone Number", "Medium"],
    ["N-Queens", "Hard"],
  ]),
  topic("Graphs", [
    ["Number of Islands", "Medium"],
    ["Max Area of Island", "Medium"],
    ["Clone Graph", "Medium"],
    ["Walls and Gates", "Medium"],
    ["Rotting Oranges", "Medium"],
    ["Pacific Atlantic Water Flow", "Medium"],
    ["Surrounded Regions", "Medium"],
    ["Course Schedule", "Medium"],
    ["Course Schedule II", "Medium"],
    ["Graph Valid Tree", "Medium"],
    ["Number of Connected Components in an Undirected Graph", "Medium"],
    ["Redundant Connection", "Medium"],
    ["Word Ladder", "Hard"],
  ]),
  topic("Advanced Graphs", [
    ["Reconstruct Itinerary", "Hard"],
    ["Min Cost to Connect All Points", "Medium"],
    ["Network Delay Time", "Medium"],
    ["Swim in Rising Water", "Hard"],
    ["Alien Dictionary", "Hard"],
    ["Cheapest Flights Within K Stops", "Medium"],
  ]),
  topic("1-D Dynamic Programming", [
    ["Climbing Stairs", "Easy"],
    ["Min Cost Climbing Stairs", "Easy"],
    ["House Robber", "Medium"],
    ["House Robber II", "Medium"],
    ["Longest Palindromic Substring", "Medium"],
    ["Palindromic Substrings", "Medium"],
    ["Decode Ways", "Medium"],
    ["Coin Change", "Medium"],
    ["Maximum Product Subarray", "Medium"],
    ["Word Break", "Medium"],
    ["Longest Increasing Subsequence", "Medium"],
    ["Partition Equal Subset Sum", "Medium"],
  ]),
  topic("2-D Dynamic Programming", [
    ["Unique Paths", "Medium"],
    ["Longest Common Subsequence", "Medium"],
    ["Best Time to Buy and Sell Stock with Cooldown", "Medium"],
    ["Coin Change II", "Medium"],
    ["Target Sum", "Medium"],
    ["Interleaving String", "Medium"],
    ["Longest Increasing Path in a Matrix", "Hard"],
    ["Distinct Subsequences", "Hard"],
    ["Edit Distance", "Medium"],
    ["Burst Balloons", "Hard"],
    ["Regular Expression Matching", "Hard"],
  ]),
  topic("Greedy", [
    ["Maximum Subarray", "Medium"],
    ["Jump Game", "Medium"],
    ["Jump Game II", "Medium"],
    ["Gas Station", "Medium"],
    ["Hand of Straights", "Medium"],
    ["Merge Triplets to Form Target Triplet", "Medium"],
    ["Partition Labels", "Medium"],
    ["Valid Parenthesis String", "Medium"],
  ]),
  topic("Intervals", [
    ["Insert Interval", "Medium"],
    ["Merge Intervals", "Medium"],
    ["Non-overlapping Intervals", "Medium"],
    ["Meeting Rooms", "Easy"],
    ["Meeting Rooms II", "Medium"],
    ["Minimum Interval to Include Each Query", "Hard"],
  ]),
  topic("Math & Geometry", [
    ["Rotate Image", "Medium"],
    ["Spiral Matrix", "Medium"],
    ["Set Matrix Zeroes", "Medium"],
    ["Happy Number", "Easy"],
    ["Plus One", "Easy"],
    ["Pow(x, n)", "Medium"],
    ["Multiply Strings", "Medium"],
    ["Detect Squares", "Medium"],
  ]),
  topic("Bit Manipulation", [
    ["Single Number", "Easy"],
    ["Number of 1 Bits", "Easy"],
    ["Counting Bits", "Easy"],
    ["Reverse Bits", "Easy"],
    ["Missing Number", "Easy"],
    ["Sum of Two Integers", "Medium"],
    ["Reverse Integer", "Medium"],
  ]),
].flat();

/** LeetCode address for a problem name, e.g. "Pow(x, n)" → …/problems/powx-n/. */
export function leetcodeUrl(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return `https://leetcode.com/problems/${slug}/`;
}
