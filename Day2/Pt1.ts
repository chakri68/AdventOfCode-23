export type Color = [number, number, number];
export const ColorArr = ["red", "green", "blue"];

export function parseText(inp: string): Record<number, Color[]> {
  const games = inp
    .split("\n")
    .map((game) => game.trim())
    .filter((game) => game.length > 0);
  const res: Record<number, Color[]> = {};

  for (const game of games) {
    const [gameNum, dips] = game.split(": ");
    const gameNumInt = parseInt(gameNum.split(" ")[1], 10);
    // console.log({ game, gameNum, dips });

    const dipArr = dips.split("; ");
    const colorArr: Color[] = [];

    for (const dip of dipArr) {
      //   console.log({ dip });
      const dipColors = dip.split(", ");
      const dipColor: Color = [0, 0, 0];

      for (const color of dipColors) {
        // console.log({ color });
        const [colorVal, colorName] = color.split(" ");
        const idx = ColorArr.indexOf(colorName);
        if (idx === -1) {
          //   console.error(`Invalid color: ${colorName} in ${ColorArr}`);
          throw new Error(`Invalid color`);
        }
        dipColor[idx] = parseInt(colorVal, 10);
      }

      colorArr.push(dipColor);
    }

    res[gameNumInt] = colorArr;
  }

  return res;
}

export function checkPossibility(color: Color, maxColors: Color) {
  return color.reduce((acc, cur, idx) => acc && cur <= maxColors[idx], true);
}

function getPossibility(inp: string, colors: Color) {
  const games = parseText(inp);
  let res = 0;

  //   console.log({ games });

  for (const [gameInt, game] of Object.entries(games)) {
    const isCorrect = game.reduce(
      (acc, curr) => acc && checkPossibility(curr, colors),
      true
    );
    if (isCorrect) res += parseInt(gameInt, 10);
  }

  return res;
}

if (import.meta.main) {
  const inp = Deno.readTextFileSync("inputs/2.txt");
  console.log(getPossibility(inp, [12, 13, 14]));
  // console.log(
  //   getPossibility(
  //     `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  // Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
  // Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
  // Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
  // Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
  //     [12, 13, 14]
  //   )
  // );
}
