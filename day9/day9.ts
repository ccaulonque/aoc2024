const path = "../inputs/day9.txt";
const file = Bun.file(path);

const text = await file.text();

const numbers = text.split("").map(Number);

const mapped = numbers.reduce<Array<null | number>>((acc, current, index) => {
  let content = index % 2 === 0 ? index / 2 : null;
  for (let i = 0; i < current; i++) {
    acc.push(content);
  }
  return acc;
}, []);

while (true) {
  const lastNumber = mapped.findLastIndex((number) => !!number);
  const firstNull = mapped.findIndex((number) => number === null);
  if (firstNull > lastNumber) {
    break;
  }
  const temp = mapped[lastNumber];
  mapped[lastNumber] = mapped[firstNull];
  mapped[firstNull] = temp;
}

const total = mapped.reduce<number>((acc, current, index) => {
  if (!current) return acc;
  return acc + index * current;
}, 0);

console.log(total);
