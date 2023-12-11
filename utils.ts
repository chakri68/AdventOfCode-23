export function readInput(fileName: string): string {
  const file = Deno.readTextFileSync(fileName);
  return file;
}

export function isDigit(char: string) {
  return !isNaN(parseInt(char, 10));
}
