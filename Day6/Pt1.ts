import { readInput } from "../utils.ts";
import { Pipe } from "../utils.ts";

function parseInput(inp: string) {
  const [times, distances] = new Pipe(inp.split("\n") as [string, string])
    .then(([a, b]) => [
      a
        .split(":")[1]
        .trim()
        .split(" ")
        .filter((str) => str.length > 0)
        .map((num) => parseInt(num)),
      b
        .split(":")[1]
        .trim()
        .split(" ")
        .filter((str) => str.length > 0)
        .map((num) => parseInt(num)),
    ])
    .val();

  return {
    times,
    distances,
  };
}

export function getErrorMargin(times: number[], distances: number[]): number {
  return times.reduce((acc, T, idx) => {
    const D = distances[idx];
    const deter = Math.sqrt(T ** 2 - 4 * D);
    const [A, B] = [(T - deter) / 2, (T + deter) / 2];
    let [a, b] = [Math.ceil(A), Math.floor(B)];
    if (a === A) a += 1;
    if (b == B) b -= 1;
    return acc * (b - a + 1);
  }, 1);
}

if (import.meta.main) {
  const inp = readInput("./inputs/6.txt");
  const { times, distances } = parseInput(inp);
  console.log(getErrorMargin(times, distances));
}
