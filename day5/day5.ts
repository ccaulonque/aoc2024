const path = "../inputs/day5.txt";
const file = Bun.file(path);

const text = await file.text();

type Rules = [number, number][];

const rules: Rules = [];
let firstPart = true;

let total = 0;

for (const line of text.split("\n")) {
  if (line.trim() === "") {
    firstPart = false;
    continue;
  }
  if (firstPart) {
    const [a, b] = line.split("|").map(Number);
    rules.push([a, b]);
  } else {
    const numbers = line.split(",").map(Number);
    total += checkLine(numbers, rules);
  }
}
console.log(total);

function checkLine(line: number[], rules: Rules): number {
  let ok = false;
  let wasFalse = false;
  while (!ok) {
    ok = true;
    line.forEach((_, i) => {
      rules.forEach(([a, b]) => {
        if (a === line[i]) {
          const bBefore = line.slice(0, i).indexOf(b);
          if (bBefore !== -1) {
            ok = false;
            wasFalse = true;
            line[i] = b;
            line[bBefore] = a;
          }
        }
        return true;
      });
    });
    if (!wasFalse) {
      break;
    }
  }
  if (wasFalse) {
    const i = Math.floor(line.length / 2);
    console.log(line);
    return line[i];
  }
  return 0;
}
