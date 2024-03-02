import { readInput } from "../utils.ts";

function parseInput(inp: string) {
  return inp
    .trim()
    .split("\n")
    .map((str) =>
      str
        .trim()
        .split(" ")
        .map((s) => parseInt(s))
    );
}

function getPrevEl(sequence: number[]): number {
  const diffArr: number[] = [];
  let isDiffSame = true;
  for (let i = 1; i < sequence.length; i++) {
    const diff = sequence[i] - sequence[i - 1];
    isDiffSame = diff === 0;
    diffArr.push(diff);
  }
  if (isDiffSame) return sequence[sequence.length - 1];
  const nextEl = sequence[0] - getPrevEl(diffArr);
  return nextEl;
}

if (import.meta.main) {
  const sequences = parseInput(readInput("./inputs/9.txt"));
  const s = sequences.reduce((acc, seq) => acc + getPrevEl(seq), 0);
  console.log(s);
}
