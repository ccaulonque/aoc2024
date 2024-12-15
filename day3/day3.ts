const path = "../inputs/day3.txt";
const file = Bun.file(path);

const text = await file.text();

const splits = text.split("don't()");
let total = 0;
splits.forEach((split, i) => {
  const n = split.indexOf("do()");
  if (n < 0 && i > 0) {
    return;
  }
  const secondPart = split.slice(i > 0 ? n + 4 : 0);
  const subtotal = getTotalFromString(secondPart);
  total += subtotal;
});
console.log(total);

function getTotalFromString(text: string): number {
  const r = /mul\((\d+),(\d+)\)/g;

  let m;

  let total = 0;
  while ((m = r.exec(text)) !== null) {
    if (m.index === r.lastIndex) {
      r.lastIndex++;
    }

    const [, a, b] = m;

    const aNumber = parseInt(a);
    const bNumber = parseInt(b);
    total += aNumber * bNumber;
  }

  return total;
}
