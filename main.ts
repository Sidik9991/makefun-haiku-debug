// Seventeen Syllables of Debugging — make.fun bounty
// u-irvan-motion-seventeen-syllables-of-debugging-d194b605
//
// v1: first candidate. Writes one haiku (5-7-5, 3 lines, <=200 chars) to
// /output/entry.txt, then re-reads the file and validates it in code:
// exactly 3 lines, syllable counts 5/7/5, total length <= 200 chars.
// Node 22, zero dependencies, fully deterministic.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// --- the haiku (v1 candidate) ---
// Opens mid-scene on the brief's own concrete image — a cursor blinking
// at 3am — and turns on the last line: the bug is mine.
const HAIKU = [
  "three a.m. cursor",
  "blinks beside the same wrong line",
  "the bug has my name",
];

// --- syllable counting ---
// Exact counts for every word this entry uses. Words not in the table
// fall back to a vowel-group heuristic (silent trailing "e" dropped).
const SYLLABLES = {
  "a.m.": 2, again: 2, among: 2, answer: 2, beside: 2, blames: 1,
  blinks: 1, bloom: 1, bug: 1, by: 1, code: 1, counted: 2, cursor: 2,
  dead: 1, dot: 1, duck: 1, each: 1, ends: 1, explain: 2, frame: 1,
  from: 1, glows: 1, glowing: 2, has: 1, hear: 1, here: 1, hid: 1,
  I: 1, it: 1, letter: 2, lies: 1, line: 1, listens: 2, log: 1,
  loop: 1, lying: 2, misplaced: 2, my: 1, name: 1, never: 2, nine: 1,
  off: 1, on: 1, one: 1, past: 1, planted: 2, printfs: 2, red: 1,
  rubber: 2, runs: 1, same: 1, slowly: 2, soon: 1, spotless: 2,
  stack: 1, step: 1, stops: 1, swore: 1, ten: 1, the: 1, there: 1,
  thousand: 2, three: 1, through: 1, too: 1, trace: 1, scrolls: 1,
  was: 1, weeds: 1, while: 1, wrong: 1,
};

function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z.]/g, "");
  if (w in SYLLABLES) return SYLLABLES[w];
  const groups = w.replace(/e$/, "").match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

function countLine(line) {
  return line.split(/\s+/).filter(Boolean).reduce((n, w) => n + countSyllables(w), 0);
}

// --- write, re-read, validate ---
const outDir = process.env.OUTPUT_DIR ?? "/output";
const text = HAIKU.join("\n") + "\n";
try {
  mkdirSync(outDir, { recursive: true });
} catch {
  // /output may not be writable in a local shell; fall back to ./output.
}
let outPath = `${outDir}/entry.txt`;
try {
  writeFileSync(outPath, text, "utf8");
} catch {
  mkdirSync("output", { recursive: true });
  outPath = "output/entry.txt";
  writeFileSync(outPath, text, "utf8");
}

const back = readFileSync(outPath, "utf8");
const lines = back.replace(/\n$/, "").split("\n");
const counts = lines.map(countLine);
if (lines.length !== 3) throw new Error(`expected 3 lines, got ${lines.length}`);
if (counts.join("/") !== "5/7/5") throw new Error(`expected 5/7/5, got ${counts.join("/")}`);
if (back.length > 200) throw new Error(`over 200 chars: ${back.length}`);
if (!back.trim()) throw new Error("entry is blank");

console.log(`wrote ${outPath} (${back.length} chars, syllables ${counts.join("/")})`);
console.log(back);
