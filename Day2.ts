import { readInput } from "./utils.ts";

const validDigits: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

type TrieNode = Map<string, TrieNode | number>;

function buildTrie(charMap: Record<string, number>): TrieNode {
  const root: TrieNode = new Map();
  for (const char in charMap) {
    let node = root;
    for (const c of char) {
      if (!node.has(c)) {
        node.set(c, new Map());
      }
      node = node.get(c) as TrieNode;
    }
    node.set("end", charMap[char]);
  }
  return root;
}

function printTrie(trie: TrieNode, indent: string = ""): void {
  for (const [key, value] of trie.entries()) {
    if (key === "end") {
      console.log(`${indent}end: ${value}`);
    } else {
      console.log(`${indent}${key}`);
      if (value instanceof Map) {
        printTrie(value, `${indent}  `);
      }
    }
  }
}

function isDigit(char: string) {
  return /\d/.test(char);
}

function getCalibrationVal(inp: string) {
  const lines = inp.split("\n").map((line) => line.trim());
  let sum = 0;

  const forwardTrie = buildTrie(validDigits);
  const backwardTrie = buildTrie(
    Object.fromEntries(
      Object.entries(validDigits).map(([k, v]) => [
        k.split("").reverse().join(""),
        v,
      ])
    )
  );

  for (const line of lines) {
    let currTrieNode = forwardTrie;

    // console.log({ line });

    for (let i = 0; i < line.length; i++) {
      if (isDigit(line[i])) {
        // console.log({ foundDigit: line[i] });
        sum += parseInt(line[i]) * 10;
        break;
      }
      if (currTrieNode.has(line[i])) {
        currTrieNode = currTrieNode.get(line[i]) as TrieNode;
      } else {
        console.log("reset");
        if (forwardTrie.has(line[i])) {
          currTrieNode = forwardTrie.get(line[i]) as TrieNode;
        } else {
          currTrieNode = forwardTrie;
        }
      }

      // Check if we have an end at the current node
      if (currTrieNode.has("end")) {
        // console.log({ foundDigit: currTrieNode.get("end") });
        sum += (currTrieNode.get("end") as number) * 10;
        break;
      }
    }

    currTrieNode = backwardTrie;

    for (let j = line.length - 1; j >= 0; j--) {
      // console.log({ char: line[j] });
      // printTrie(currTrieNode);
      if (isDigit(line[j])) {
        // console.log({ foundDigit: line[j] });
        sum += parseInt(line[j]);
        break;
      }

      if (currTrieNode.has(line[j])) {
        currTrieNode = currTrieNode.get(line[j]) as TrieNode;
      } else {
        // console.log("reset");
        if (backwardTrie.has(line[j])) {
          currTrieNode = backwardTrie.get(line[j]) as TrieNode;
        } else {
          currTrieNode = backwardTrie;
        }
      }
      // Check if we have a end at the current node
      if (currTrieNode.has("end")) {
        // console.log({ foundDigit: currTrieNode.get("end") });
        sum += currTrieNode.get("end") as number;
        break;
      }
    }
  }

  return sum;
}

const inp = readInput("inputs/2.txt");
const result = getCalibrationVal(inp);
// const result = getCalibrationVal(`dwnv2ievhnioehv2iouhsixvbiu`);
console.log(result);
