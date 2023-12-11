import { Color, parseText } from "./Pt1.ts";

export function getPower(color: Color) {
  return color.reduce((acc, cur) => acc * cur, 1);
}

function getMinColor(inp: string) {
  const games = parseText(inp);
  let res = 0;

  for (const game of Object.values(games)) {
    // Get minimum of every color component
    // console.log({ game });

    const minColor = game.reduce(
      (acc, curr) =>
        acc.map((color, idx) => Math.max(color, curr[idx])) as Color,
      [0, 0, 0]
    );

    const power = getPower(minColor);

    // console.log({ minColor, power });

    res += power;
  }
  return res;
}

if (import.meta.main) {
  const inp = Deno.readTextFileSync("inputs/2.txt");
  console.log(getMinColor(inp));

  //   console.log(
  //     getMinColor(`Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  // Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
  // Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
  // Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
  // Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`)
  //   );
}
