import { readInput } from "../utils.ts";

enum HandType {
  FIVE,
  FOUR,
  FULL,
  THREE,
  TWO,
  ONE,
  HIGH,
}

const CardStrength = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
};

class Hand {
  public handType: HandType;

  constructor(public cards: string, public bid: number) {
    this.handType = Hand.getHandType(cards);
  }

  static getHandType(cards: string) {
    const charCountsMap: Record<string, number> = {};
    for (const char of cards) {
      if (typeof charCountsMap[char] === "number") {
        charCountsMap[char] += 1;
      } else {
        charCountsMap[char] = 1;
      }
    }
    const charCounts = Object.entries(charCountsMap)
      .toSorted(([, v1], [, v2]) => v2 - v1)
      .map(([, v1]) => v1)
      .join("");
    switch (charCounts) {
      case "5":
        return HandType.FIVE;
      case "41":
        return HandType.FOUR;
      case "32":
        return HandType.FULL;
      case "311":
        return HandType.THREE;
      case "221":
        return HandType.TWO;
      case "2111":
        return HandType.ONE;
      default:
        return HandType.HIGH;
    }
  }

  static compareCards(a: string, b: string): boolean {
    const aChar = a[0];
    const bChar = b[0];

    if (aChar === bChar) return this.compareCards(a.slice(1), b.slice(1));
    let aNum, bNum;
    if (aChar.match(/\d/)) {
      aNum = parseInt(aChar);
    } else {
      aNum = CardStrength[aChar as keyof typeof CardStrength];
    }
    if (bChar.match(/\d/)) {
      bNum = parseInt(bChar);
    } else {
      bNum = CardStrength[bChar as keyof typeof CardStrength];
    }

    return aNum > bNum;
  }
}

function parseInput(inp: string) {
  const hands = inp.trim().split("\n");
  return hands.map((hand) => {
    const [cards, bid] = hand.split(" ");
    return new Hand(cards.trim(), parseInt(bid));
  });
}

function getTotalWinnings(hands: Hand[]) {
  const sortedHands = hands.toSorted((a, b) => {
    if (a.handType !== b.handType) return b.handType - a.handType;
    const cmp = Hand.compareCards(a.cards, b.cards);
    if (cmp) return 1;
    return -1;
  });
  return sortedHands.reduce((acc, hand, idx) => {
    return acc + hand.bid * (idx + 1);
  }, 0);
}

if (import.meta.main) {
  const hands = parseInput(readInput("./inputs/7.txt"));
  console.log(getTotalWinnings(hands));
}
