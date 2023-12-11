import { isDigit } from "../utils.ts";
import { Idx } from "./Pt1.ts";

function getNumberAtIdx(idx: Idx, inpArr: string[][]): number {
  //   console.log({ queryIdx: idx });
  let leftIdx = idx[0],
    rightIdx = idx[0];

  while (leftIdx > 0 && isDigit(inpArr[idx[1]][leftIdx - 1])) {
    // console.log({ leftIdx });
    leftIdx -= 1;
  }
  while (
    rightIdx < inpArr[idx[1]].length - 1 &&
    isDigit(inpArr[idx[1]][rightIdx + 1])
  ) {
    rightIdx += 1;
  }

  //   console.log({ num: inpArr[idx[1]].slice(leftIdx, rightIdx + 1).join("") });

  return parseInt(inpArr[idx[1]].slice(leftIdx, rightIdx + 1).join(""));
}

function getSurroundingNumbers(idx: Idx, inpArr: string[][]): number[] {
  //   console.log({ idx });

  const surroundingNumbers: number[] = [];

  const topRow = inpArr[idx[1] - 1].slice(idx[0] - 1, idx[0] + 2).join("");
  const left = inpArr[idx[1]][idx[0] - 1];
  const right = inpArr[idx[1]][idx[0] + 1];
  const bottomRow = inpArr[idx[1] + 1].slice(idx[0] - 1, idx[0] + 2).join("");

  // Get the numbers in the top row
  const re = /\d+/g;

  let match;
  while ((match = re.exec(topRow)) != null) {
    // console.log(match);
    surroundingNumbers.push(
      getNumberAtIdx([match.index + idx[0] - 1, idx[1] - 1], inpArr)
    );
  }

  // Get the number in the left and right
  if (isDigit(left))
    surroundingNumbers.push(getNumberAtIdx([idx[0] - 1, idx[1]], inpArr));
  if (isDigit(right))
    surroundingNumbers.push(getNumberAtIdx([idx[0] + 1, idx[1]], inpArr));

  // Get the numbers in the bottom row
  while ((match = re.exec(bottomRow)) != null)
    surroundingNumbers.push(
      getNumberAtIdx([match.index + idx[0] - 1, idx[1] + 1], inpArr)
    );

  //   console.log({ surroundingNumbers });
  return surroundingNumbers;
}

function getSum(inp: string) {
  const inpArr = inp.split("\n").map((row) => row.trim());
  const inpArr2 = inp.split("\n").map((row) => row.trim().split(""));
  let sum = 0;

  for (let j = 0; j < inpArr.length; j++) {
    const row = inpArr[j];

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char !== "*") continue;
      // Check if this symbol has only 2 diff numbers surrounding it

      const surroundingNumbers = getSurroundingNumbers([i, j], inpArr2);
      if (surroundingNumbers.length !== 2) continue;

      const [num1, num2] = surroundingNumbers;

      sum += num1 * num2;
    }
  }

  return sum;
}

if (import.meta.main) {
  const input = await Deno.readTextFile("inputs/3.txt");
  console.log(getSum(input));
  //   console.log(
  //     getSum(`467..114..
  //   ...*......
  //   ..35..633.
  //   ......#...
  //   617*......
  //   .....+.58.
  //   ..592.....
  //   ......755.
  //   ...$.*....
  //   .664.598..`)
  //   );
}
