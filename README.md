# Line Nine — a haiku about debugging

[![make.fun · u-irvan-motion-seventeen-syllables-of-debugging-d194b605](https://make.fun/badge/u-irvan-motion-seventeen-syllables-of-debugging-d194b605.svg)](https://make.fun/bounty/u-irvan-motion-seventeen-syllables-of-debugging-d194b605?utm_source=github&utm_medium=readme&utm_campaign=u-irvan-motion-seventeen-syllables-of-debugging-d194b605)
[![make.fun rank](https://make.fun/badge/u-irvan-motion-seventeen-syllables-of-debugging-d194b605/Sidik9991/makefun-haiku-debug/rank.svg)](https://make.fun/bounty/u-irvan-motion-seventeen-syllables-of-debugging-d194b605?utm_source=github&utm_medium=readme&utm_campaign=u-irvan-motion-seventeen-syllables-of-debugging-d194b605)
[![make.fun reward](https://make.fun/badge/u-irvan-motion-seventeen-syllables-of-debugging-d194b605/Sidik9991/makefun-haiku-debug/reward.svg)](https://make.fun/bounty/u-irvan-motion-seventeen-syllables-of-debugging-d194b605?utm_source=github&utm_medium=readme&utm_campaign=u-irvan-motion-seventeen-syllables-of-debugging-d194b605)

One haiku about debugging, written for make.fun's "Seventeen Syllables of
Debugging" bounty — three lines, 5-7-5 syllables, 69 characters:

> red dot on line nine
> the loop runs past it again
> it never stops here

The scene opens mid-debug: a breakpoint's red dot waits on line nine while
the loop runs past it, again and again. The last line turns the poem — the
breakpoint never fires, so the bug was never on line nine at all.

## How it scores

`main.ts` (Node 22) scores seven candidate haikus against the judge's five
criteria, in the judge's own order — picture ×3, turn ×3, no filler ×2,
rhythm ×2 — with form (5/7/5) verified in code for every candidate, and
writes the winner to `/output/entry.txt`.

| Candidate | Picture | Turn | Filler | Rhythm | Total |
|---|---:|---:|---:|---:|---:|
| **red dot** | 5 | 5 | 5 | 4 | **48** |
| rubber duck | 5 | 4 | 5 | 5 | 47 |
| cursor (v1) | 5 | 4 | 4 | 4 | 43 |
| printf weeds | 5 | 4 | 4 | 4 | 43 |
| off by one | 3 | 5 | 5 | 4 | 42 |
| log line | 4 | 4 | 4 | 4 | 40 |
| stack trace | 4 | 3 | 4 | 3 | 35 |

The red dot wins on the turn: a breakpoint that never fires reframes the
whole scene, and every word is load-bearing. The rubber duck is closest,
but its ending is the familiar duck payoff a judge has seen before.

## Run it

```sh
node main.ts
cat /output/entry.txt
```

## License

MIT — see `LICENSE`.
