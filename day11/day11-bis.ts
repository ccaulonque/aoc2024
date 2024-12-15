const path = "../inputs/day11.txt";
const file = Bun.file(path);

const text = await file.text();

const numbers = text.split(" ").map(Number);

const ITERATIONS = 75;

console.time("execution");

function evenDigits(n: number): [boolean, number, number] {
  const digits = Math.floor(Math.log10(n)) + 1;
  if (digits % 2 === 0) {
    const divisor = Math.pow(10, digits / 2);
    return [true, Math.floor(n / divisor), n % divisor];
  }
  return [false, 0, 0];
}

let numbersMap = new Map<number, number>();
numbers.forEach((n) => {
  numbersMap.set(n, (numbersMap.get(n) || 0) + 1);
});

for (let i = 0; i < ITERATIONS; i++) {
  const entries = Array.from(numbersMap.entries());
  numbersMap = new Map<number, number>();
  for (const [current, count] of entries) {
    if (count === 0) {
      continue;
    }
    if (current === 0) {
      numbersMap.set(1, (numbersMap.get(1) || 0) + count);
      continue;
    }
    const [isEven, first, second] = evenDigits(current);
    if (isEven) {
      numbersMap.set(first, (numbersMap.get(first) || 0) + count);
      numbersMap.set(second, (numbersMap.get(second) || 0) + count);
      continue;
    }

    const newnumber = current * 2024;
    numbersMap.set(newnumber, (numbersMap.get(newnumber) || 0) + count);
  }
}

const total = Array.from(numbersMap.values()).reduce((acc, n) => acc + n, 0);
console.log({ total });

console.timeEnd("execution");
