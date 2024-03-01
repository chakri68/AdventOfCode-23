export function readInput(fileName: string): string {
  const file = Deno.readTextFileSync(fileName);
  return file;
}

export function isDigit(char: string) {
  return !isNaN(parseInt(char, 10));
}

/**
 * Useful util to pipe values with typesafety
 * USAGE: new Pipe(2 * 10).then((val) => `My Val: ${val}`).then((str) => str[0]).val()
 */
export class Pipe<P> {
  constructor(private value: P) {}
  then<Q>(callback: (val: P) => Q) {
    const val = callback(this.value);
    return new Pipe(val);
  }
  val() {
    return this.value;
  }
}
