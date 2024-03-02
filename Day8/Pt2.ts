import { readInput } from "../utils.ts";

const gcd = (a: number, b: number): number => (b == 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
const lcmAll = (ns: number[]) => ns.reduce(lcm, 1);

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

function getStep(nodes: NodeMap, seq: Sequence, startingNode: string) {
  let curNode: string = startingNode;
  let count = 0;
  while (!curNode.endsWith("Z")) {
    count += 1;
    const nextMove = seq.next();
    curNode = nodes[curNode][nextMove === "L" ? 0 : 1];
  }
  return count;
}

function getSteps(nodes: NodeMap, seq: Sequence) {
  const curNodes: string[] = Object.keys(nodes).filter((node) =>
    node.endsWith("A")
  );
  const counts = Array.from({ length: curNodes.length }, () => 0);

  for (let i = 0; i < curNodes.length; i++) {
    counts[i] = getStep(nodes, seq, curNodes[i]);
    console.log(i, counts[i]);
  }

  return lcmAll(counts);
}

if (import.meta.main) {
  const { nodes, seq } = parseInput(readInput("./inputs/8.txt").trim());
  console.log({ nodes, seq });
  console.log(getSteps(nodes, seq));
}
