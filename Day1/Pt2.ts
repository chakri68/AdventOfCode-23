import { readInput } from "../utils.ts";

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

// function printTrie(trie: TrieNode, indent: string = ""): void {
//   for (const [key, value] of trie.entries()) {
//     if (key === "end") {
//       console.log(`${indent}end: ${value}`);
//     } else {
//       console.log(`${indent}${key}`);
//       if (value instanceof Map) {
//         printTrie(value, `${indent}  `);
//       }
//     }
//   }
// }

function isDigit(char: string) {
  return !isNaN(parseInt(char, 10));
}

function getCalibrationVal(inp: string) {
  const lines = inp.split("\n").map((line) => line.trim());

  const forwardTrie = buildTrie(validDigits);
  const backwardTrie = buildTrie(
    Object.fromEntries(
      Object.entries(validDigits).map(([key, value]) => [
        key.split("").reverse().join(""),
        value,
      ])
    )
  );

  let sum = 0;

  for (const line of lines) {
    const possibleTrieNodes: TrieNode[] = [forwardTrie];

    // console.log(`LINE: ${line}`);

    // For forward trie

    // For each character
    characterLoop: for (let i = 0; i < line.length; i++) {
      // Check is this character is a digit
      if (isDigit(line[i])) {
        // console.log(`DIGIT: ${line[i]}`);
        sum += parseInt(line[i], 10) * 10;
        break characterLoop;
      }

      const newNodes: TrieNode[] = [];

      // console.log(line[i]);

      // For each possible trie node
      for (let j = 0; j < possibleTrieNodes.length; j++) {
        // Proceed if the character is in the trie
        const node = possibleTrieNodes[j];
        if (node.has(line[i])) {
          const nextNode = node.get(line[i]) as TrieNode;
          // Can move to the next node
          newNodes.push(nextNode);

          // Check if this is the end of a number
          if (nextNode.has("end")) {
            // Found the number
            // console.log(`CHAR: ${nextNode.get("end") as number}`);
            sum += (nextNode.get("end") as number) * 10;
            break characterLoop;
          }
        } else {
          // Can't proceed with this node
        }
      }

      // Check if this character can start a new digit word
      if (forwardTrie.has(line[i])) {
        const nextNode = forwardTrie.get(line[i]) as TrieNode;
        // Can move to the next node
        newNodes.push(nextNode);

        // Check if this is the end of a number
        if (nextNode.has("end")) {
          // Found the number
          sum += (nextNode.get("end") as number) * 10;
          break characterLoop;
        }
      }
      // Update the possible nodes
      possibleTrieNodes.length = 0;
      possibleTrieNodes.push(...newNodes);
    }

    // For backward trie

    // Reset the possible nodes
    possibleTrieNodes.length = 0;
    possibleTrieNodes.push(backwardTrie);

    // For each character
    characterLoop: for (let i = line.length - 1; i >= 0; i--) {
      // Check is this character is a digit
      if (isDigit(line[i])) {
        // console.log(`DIGIT: ${line[i]}`);
        sum += parseInt(line[i], 10);
        break;
      }

      // console.log(line[i]);
      // possibleTrieNodes.forEach((node) => {
      //   printTrie(node);
      //   console.log("-----");
      // });

      // console.log("==============");

      const newNodes: TrieNode[] = [];

      // For each possible trie node
      for (let j = 0; j < possibleTrieNodes.length; j++) {
        // Proceed if the character is in the trie
        const node = possibleTrieNodes[j];
        if (node.has(line[i])) {
          const nextNode = node.get(line[i]) as TrieNode;
          // Can move to the next node
          newNodes.push(nextNode);

          // Check if this is the end of a number
          if (nextNode.has("end")) {
            // Found the number
            // console.log(`CHAR: ${nextNode.get("end") as number}`);
            sum += nextNode.get("end") as number;
            break characterLoop;
          }
        } else {
          // Can't proceed with this node
        }
      }

      // Check if this character can start a new digit word
      if (backwardTrie.has(line[i])) {
        const nextNode = backwardTrie.get(line[i]) as TrieNode;
        // Can move to the next node
        newNodes.push(nextNode);

        // Check if this is the end of a number
        if (nextNode.has("end")) {
          // Found the number
          sum += nextNode.get("end") as number;
          break characterLoop;
        }
      }
      // Update the possible nodes
      possibleTrieNodes.length = 0;
      possibleTrieNodes.push(...newNodes);
    }
  }
  return sum;
}

const inp = readInput("inputs/2.txt");
const result = getCalibrationVal(inp);
// const result = getCalibrationVal(`3cjseventhreen`);
console.log(result);
