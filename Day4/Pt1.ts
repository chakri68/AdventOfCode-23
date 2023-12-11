export function parseInput(
  inp: string
): Record<number, [Set<number>, Set<number>]> {
  const cards = inp
    .split("\n")
    .map((card) => card.trim())
    .filter((card) => card.length > 0);
  const res: Record<number, [Set<number>, Set<number>]> = {};

  for (const card of cards) {
    const [cardNumStr, cardPointsStr] = card.split(": ");
    const cardNum = parseInt(cardNumStr.match(/\d+/g)![0]);
    const [winningPoints, currPoints] = cardPointsStr
      .split(" | ")
      .map(
        (pts) => new Set([...pts.matchAll(/\d+/g)].map((pt) => parseInt(pt[0])))
      );

    res[cardNum] = [winningPoints, currPoints];
  }

  //   console.log(res);

  return res;
}

function getPoints(inp: string) {
  const cardData = parseInput(inp);

  let res = 0;

  for (const cardNum of Object.keys(cardData)) {
    const [winningPoints, currPoints] = cardData[parseInt(cardNum)];
    // TODO: Use in-built set operations when they are implemented
    // Intersection size
    const intersectionSize = [...winningPoints].filter((pt) =>
      currPoints.has(pt)
    ).length;
    // console.log({
    //   intersection: [...winningPoints].filter((pt) => currPoints.has(pt)),
    // });
    if (intersectionSize > 0) res += Math.pow(2, intersectionSize - 1);
  }

  return res;
}

if (import.meta.main) {
  const inp = Deno.readTextFileSync("inputs/4.txt");
  console.log(getPoints(inp));
  //   console.log(
  //     getPoints(`Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
  // Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
  // Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
  // Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
  // Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
  // Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`)
  //   );
}
