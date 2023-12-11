import { isDigit } from "../utils.ts";

export const VALID_PLACEHOLDERS = new Set(["."]);

export type Idx = [number, number];

export function getSurroundingIndices(span: [Idx, Idx]): Idx[] {
  const [start, end] = span;
  // console.log({ start, end });
  const surroundingIndices: Idx[] = [
    [start[0] - 1, start[1] - 1],
    [start[0] - 1, start[1]],
    [start[0] - 1, start[1] + 1],
  ];

  for (let i = start[0]; i <= end[0]; i++) {
    surroundingIndices.push([i, start[1] - 1], [i, start[1] + 1]);
  }

  surroundingIndices.push(
    [end[0] + 1, start[1] - 1],
    [end[0] + 1, start[1]],
    [end[0] + 1, start[1] + 1]
  );

  return surroundingIndices;
}

export function checkIdx(idx: Idx, inp: string[][]): boolean {
  const [x, y] = idx;
  return y >= 0 && y < inp.length && x >= 0 && x < inp[y].length;
}

function getSum(inp: string) {
  const inpArr = inp.split("\n").map((row) => row.trim());
  const inpArr2 = inp.split("\n").map((row) => row.trim().split(""));
  let sum = 0;

  // Get the numbers in each row and check if their surrounding indices have a non digit, non "." character
  for (let j = 0; j < inpArr.length; j++) {
    const row = inpArr[j];
    // Match all numbers in the row
    const re = /\d+/g;

    const numberIndices: [string, [Idx, Idx]][] = [];
    let match;
    while ((match = re.exec(row)) != null) {
      numberIndices.push([
        match[0],
        [
          [match.index, j],
          [match.index + match[0].length - 1, j],
        ],
      ]);
    }

    // Check if the surrounding indices of each number have a non digit, non "." character
    for (const [number, indices] of numberIndices) {
      const surroundingIndices = getSurroundingIndices(indices);
      // console.log({ surroundingIndices });
      let valid = false;
      for (const surroundingIdx of surroundingIndices) {
        if (!checkIdx(surroundingIdx, inpArr2)) {
          continue;
        }
        // console.log({
        //   number: number,
        //   surroundingIdx: inpArr2[surroundingIdx[1]][surroundingIdx[0]],
        // });
        const [x, y] = surroundingIdx;
        if (!VALID_PLACEHOLDERS.has(inpArr2[y][x]) && !isDigit(inpArr2[y][x])) {
          // console.log("VALID");
          valid = true;
          break;
        }
      }
      if (valid) {
        // console.log({ number });
        sum += parseInt(number);
      }
    }
  }

  return sum;
}

if (import.meta.main) {
  const input = await Deno.readTextFile("inputs/3.txt");
  console.log(getSum(input));
  //   console.log(
  //     getSum(`467..114..
  // ...*......
  // ..35..633.
  // ......#...
  // 617*......
  // .....+.58.
  // ..592.....
  // ......755.
  // ...$.*....
  // .664.598..`)
  //   );
}
