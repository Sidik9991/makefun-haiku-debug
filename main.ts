// Seventeen Syllables of Debugging — make.fun bounty
// u-irvan-motion-seventeen-syllables-of-debugging-d194b605
//
// v2: second pass. v1 ("three a.m. cursor") is scored below against six
// challengers with a weighted function over the judge's five criteria, in
// the judge's own order. The function picks the winner; the program then
// writes the winner to /output/entry.txt, re-reads it and validates it in
// code: exactly 3 lines, syllable counts 5/7/5, total length <= 200 chars.
// Node 22, zero dependencies, fully deterministic.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// --- syllable counting ---
// Exact counts for every word this entry uses. Words not in the table
// fall back to a vowel-group heuristic (silent trailing "e" dropped).
const SYLLABLES = {
  "a.m.": 2, a: 1, again: 2, among: 2, answer: 2, beside: 2, blames: 1,
  blinks: 1, bloom: 1, bug: 1, by: 1, code: 1, counted: 2, cursor: 2,
  dead: 1, dot: 1, duck: 1, each: 1, ends: 1, explain: 2, frame: 1,
  from: 1, glows: 1, glowing: 2, has: 1, hear: 1, here: 1, hid: 1,
  I: 1, it: 1, letter: 2, lies: 1, like: 1, line: 1, listens: 2, log: 1,
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

// --- candidates ---
// Scores are 0-5 per criterion, weighted in the judge's order of
// importance: picture x3, turn x3, no-filler x2, rhythm x2. Form (5/7/5)
// is a gate, verified in code for every candidate — all pass.
const CANDIDATES = [
  {
    id: "cursor (v1)",
    lines: ["three a.m. cursor", "blinks beside the same wrong line", "the bug has my name"],
    // Picture is the brief's own example image, so less fresh; the turn
    // ("the bug has my name") is solid but expected.
    scores: { picture: 5, turn: 4, filler: 4, rhythm: 4 },
  },
  {
    id: "red dot",
    lines: ["red dot on line nine", "the loop runs past it again", "it never stops here"],
    // Sharpest turn of the set: a breakpoint that never fires reframes
    // the whole scene — the bug was never on line nine at all. Every
    // word is load-bearing; "red dot" is a concrete debugger object.
    scores: { picture: 5, turn: 5, filler: 5, rhythm: 4 },
  },
  {
    id: "log line",
    lines: ["one log line, glowing", "among ten thousand dead ends", "one letter, misplaced"],
    // Good haystack-to-needle turn, but "dead ends" is slightly ornamental
    // and the picture is less immediate than a breakpoint or cursor.
    scores: { picture: 4, turn: 4, filler: 4, rhythm: 4 },
  },
  {
    id: "stack trace",
    lines: ["a stack trace scrolls past", "each frame blames the one before", "frame one was lying"],
    // "Frame one was lying" anthropomorphises oddly and the middle line
    // reads clunkier aloud than the others.
    scores: { picture: 4, turn: 3, filler: 4, rhythm: 3 },
  },
  {
    id: "printf weeds",
    lines: ["printfs bloom like weeds", "through code I swore was spotless", "I planted the weeds"],
    // Fresh metaphor and a real turn, but "I swore was spotless" spends
    // two words on setup the turn then repeats.
    scores: { picture: 5, turn: 4, filler: 4, rhythm: 4 },
  },
  {
    id: "rubber duck",
    lines: ["rubber duck listens", "while I explain it, slowly", "I hear the answer"],
    // Cleanest rhythm and no filler, but the turn is the familiar
    // rubber-duck payoff — a judge who has read a hundred duck haikus
    // has seen this ending before.
    scores: { picture: 5, turn: 4, filler: 5, rhythm: 5 },
  },
  {
    id: "off by one",
    lines: ["off by one again", "the loop ends a step too soon", "I counted from one"],
    // The turn ("I counted from one") is excellent, but "off by one" is
    // an abstraction, not a scene — the weakest picture of the set.
    scores: { picture: 3, turn: 5, filler: 5, rhythm: 4 },
  },
];

const WEIGHTS = { picture: 3, turn: 3, filler: 2, rhythm: 2 };

function score(c) {
  return Object.entries(WEIGHTS).reduce((t, [k, w]) => t + c.scores[k] * w, 0);
}

// Validate every candidate's form in code, then pick the winner.
for (const c of CANDIDATES) {
  const counts = c.lines.map(countLine);
  if (c.lines.length !== 3 || counts.join("/") !== "5/7/5") {
    throw new Error(`${c.id}: bad form ${counts.join("/")} (need 5/7/5)`);
  }
  c.total = score(c);
}
const ranked = [...CANDIDATES].sort((a, b) => b.total - a.total);
for (const c of ranked) console.log(`${String(c.total).padStart(2)}  ${c.id}`);
const WINNER = ranked[0];

// --- the haiku: the scored winner ---
// "red dot" (48): the breakpoint that never fires. The red dot waits on
// line nine, the loop runs past it again and again — and the last line
// reframes everything: it never stops here, so the bug lives elsewhere.
const HAIKU = WINNER.lines;

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

console.log(`winner: ${WINNER.id} (${WINNER.total})`);
console.log(`wrote ${outPath} (${back.length} chars, syllables ${counts.join("/")})`);
console.log(back);
