import { parseInput } from "./Pt1.ts";

function getCards(inp: string) {
  const cards = parseInput(inp);

  const cardCount = Array.from({ length: Object.keys(cards).length }, () => 1);

  for (const cardNum of Object.keys(cards)) {
    const [winningPoints, currPoints] = cards[parseInt(cardNum)];
    const intersectionSize = [...winningPoints].filter((pt) =>
      currPoints.has(pt)
    ).length;
    const generatedCards = Array.from(
      { length: intersectionSize },
      (_, i) => i + parseInt(cardNum) + 1
    );
    for (const genCard of generatedCards) {
      cardCount[genCard - 1] += cardCount[parseInt(cardNum) - 1];
    }
  }

  return cardCount.reduce((acc, cur) => acc + cur, 0);
}

if (import.meta.main) {
  const inp = Deno.readTextFileSync("inputs/4.txt");
  console.log(getCards(inp));
  //   console.log(
  //     getCards(`Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
  // Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
  // Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
  // Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
  // Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
  // Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`)
  //   );
}
