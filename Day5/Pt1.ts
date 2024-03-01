type Range = [number, number];
type RangeMap = [Range, Range][];

function getLowestLocatedSeed(inp: string) {
  const [seedsStr, ...mapsStr] = inp.split("\n\n");

  const seeds = seedsStr.split(": ")[1].split(" ").map(Number);

  let workingRanges = generateInitialRanges(parseMap(mapsStr[0]));
  for (const mapStr of mapsStr) {
    const rangeMap = parseMap(mapStr);
    workingRanges = workingRanges.flatMap((range) =>
      transformRange(range, rangeMap)
    );
    console.log({ workingRanges });
  }

  // Find the lowest working range that contains a seed
  let lowestRange = Infinity;

  for (const seed of seeds) {
    const range = getRange(seed, workingRanges);
    console.log({ seed, range });
    if (range < lowestRange) {
      lowestRange = range;
    }
  }

  return lowestRange;
}

function getRange(idx: number, ranges: Range[]) {
  let l = 0;
  let i = 0;
  const lengths = ranges.slice(0, ranges.length - 1).map(([x, y]) => y - x);

  for (const length of lengths) {
    l += length;
    if (idx < i) break;
    i += 1;
  }

  return lengths[i];
}

function getIntersectingRangeMap(range: Range, rangeMap: RangeMap): RangeMap {
  const sortedRangeMap = rangeMap.toSorted(
    (a, b) => a[0][0] - b[0][0]
  ) as RangeMap;
  return sortedRangeMap.reduce((acc: RangeMap, curr: [Range, Range]) => {
    const [currRange, currRangeMap] = curr;
    const [currRangeStart, currRangeEnd] = currRange;
    const [currRangeMapStart, currRangeMapEnd] = currRangeMap;
    const [rangeStart, rangeEnd] = range;

    if (rangeStart > currRangeEnd || rangeEnd <= currRangeStart) {
      return acc;
    }

    let endRangeStart, endRangeEnd, endMapStart, endMapEnd;
    if (Math.max(rangeStart, currRangeStart) === currRangeStart) {
      endRangeStart = currRangeStart;
      endMapStart = currRangeMapStart;
    } else {
      endRangeStart = rangeStart;
      endMapStart = currRangeMapStart + (rangeStart - currRangeStart);
    }

    if (Math.min(rangeEnd, currRangeEnd) === currRangeEnd) {
      endRangeEnd = currRangeEnd;
      endMapEnd = currRangeMapEnd;
    } else {
      endRangeEnd = rangeEnd;
      endMapEnd = currRangeMapEnd - (currRangeEnd - rangeEnd);
    }

    const endRange = [endRangeStart, endRangeEnd] as Range;
    const endMap = [endMapStart, endMapEnd] as Range;

    return [...acc, [endRange, endMap]];
  }, []);
}

function transformRange(range: Range, rangeMap: RangeMap): Range[] {
  const intersectingRangeMap = getIntersectingRangeMap(range, rangeMap);

  //   console.log({ intersectingRangeMap });

  const [rangeStart, rangeEnd] = range;
  const transformedRange: Range[] = [];

  if (intersectingRangeMap.length === 0) {
    return [range];
  }
  if (rangeStart < intersectingRangeMap[0][0][0]) {
    transformedRange.push([rangeStart, intersectingRangeMap[0][0][0]]);
  }

  intersectingRangeMap.forEach((curr, i) => {
    const [currRange, currRangeMap] = curr;
    const [currRangeStart, currRangeEnd] = currRange;
    const [currRangeMapStart, currRangeMapEnd] = currRangeMap;

    transformedRange.push([currRangeMapStart, currRangeMapEnd]);

    if (i === intersectingRangeMap.length - 1) {
      if (rangeEnd > currRangeEnd) {
        transformedRange.push([currRangeEnd, rangeEnd]);
      }
    } else {
      const nextRange = intersectingRangeMap[i + 1][0];
      const [nextRangeStart, nextRangeEnd] = nextRange;
      if (rangeEnd > currRangeEnd && rangeEnd < nextRangeStart) {
        transformedRange.push([currRangeEnd, rangeEnd]);
      }
    }
  });

  return transformedRange;
}

function generateInitialRanges(rangeMap: RangeMap) {
  const sortedRangeMap = rangeMap.toSorted(
    (a, b) => a[0][0] - b[0][0]
  ) as RangeMap;

  const initialRanges: Range[] = [];

  if (sortedRangeMap[0][0][0] > 0) {
    initialRanges.push([0, sortedRangeMap[0][0][0]]);
  }

  sortedRangeMap.forEach((curr, i) => {
    const [currRange, currRangeMap] = curr;
    const [currRangeStart, currRangeEnd] = currRange;

    initialRanges.push(currRange);

    if (i === sortedRangeMap.length - 1) {
      initialRanges.push([currRangeEnd, Infinity]);
    } else {
      const nextRange = sortedRangeMap[i + 1][0];
      const [nextRangeStart, nextRangeEnd] = nextRange;
      if (currRangeEnd < nextRangeStart) {
        initialRanges.push([currRangeEnd, nextRangeStart]);
      }
    }
  });

  return initialRanges;
}

function parseMap(s: string): RangeMap {
  const rangeMap: RangeMap = [];
  const lines = s.split("\n").slice(1);

  for (const line of lines) {
    const [a, b, length] = line.split(" ").map(Number);
    const aRange = [a, a + length] as Range;
    const bRange = [b, b + length] as Range;

    rangeMap.push([aRange, bRange]);
  }

  return rangeMap;
}

const inp = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

console.log(getLowestLocatedSeed(inp));
