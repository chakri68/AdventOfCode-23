import { readInput } from "../utils.ts";

function getCalibrationVal(string: string): number {
  const lines = string.split("\n");
  let sum = 0;
  for (const line of lines) {
    for (const char of line) {
      if (!isNaN(parseInt(char))) {
        sum += parseInt(char) * 10;
        break;
      }
    }

    for (let i = line.length - 1; i >= 0; i--) {
      if (!isNaN(parseInt(line[i]))) {
        sum += parseInt(line[i]);
        break;
      }
    }
  }
  return sum;
}

const text = readInput("inputs/1.txt");
const result = getCalibrationVal(text);
console.log(result);
