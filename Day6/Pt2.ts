import { readInput } from "../utils.ts";
import { Pipe } from "../utils.ts";
import { getErrorMargin } from "./Pt1.ts";

function parseInput(inp: string) {
  const [times, distances] = new Pipe(inp.split("\n") as [string, string])
    .then(([a, b]) => [
      parseInt(
        a
          .split(":")[1]
          .trim()
          .split(" ")
          .filter((str) => str.length > 0)
          .join("")
      ),
      parseInt(
        b
          .split(":")[1]
          .trim()
          .split(" ")
          .filter((str) => str.length > 0)
          .join("")
      ),
    ])
    .val();

  return {
    times,
    distances,
  };
}

if (import.meta.main) {
  const inp = readInput("./inputs/6.txt");
  const { times, distances } = parseInput(inp);
  console.log(getErrorMargin([times], [distances]));
}
