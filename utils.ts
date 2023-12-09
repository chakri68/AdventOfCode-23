export function readInput(fileName: string): string {
  const file = Deno.readTextFileSync(fileName);
  return file;
}
