import { readInput } from "../utils.ts";

class Sequence {
  private count: number = -1;

  constructor(public seq: string) {}

  next() {
    this.count = (this.count + 1) % this.seq.length;
    return this.seq[this.count];
  }
}

type NodeMap = { [x: string]: [string, string] };

function parseInput(inp: string) {
  const lines = inp.split("\n").map((line) => line.trim());
  const seq = new Sequence(lines[0]);
  lines.splice(0, 2);
  const nodes: NodeMap = {};
  for (const line of lines) {
    const [, from, left, right] = /(.+)\s=\s\((.+),\s(.+)\)/.exec(
      line
    ) as RegExpExecArray;
    nodes[from] = [left, right];
  }

  return { nodes, seq };
}

function getSteps(nodes: NodeMap, seq: Sequence) {
  let curNode: string = "AAA";
  let count = 0;
  while (curNode !== "ZZZ") {
    count += 1;
    const nextMove = seq.next();
    curNode = nodes[curNode][nextMove === "L" ? 0 : 1];
  }
  return count;
}

if (import.meta.main) {
  const { nodes, seq } = parseInput(readInput("./inputs/8.txt").trim());
  console.log(getSteps(nodes, seq));
}
