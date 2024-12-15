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

let newNumbers = numbers;
for (let i = 0; i < ITERATIONS; i++) {
  console.log("Iteration", i);
  const acc: number[] = [];
  for (const current of newNumbers) {
    if (current === 0) {
      acc.push(1);
      continue;
    }
    const [isEvent, first, second] = evenDigits(current);
    if (isEvent) {
      acc.push(first, second);
      continue;
    }
    acc.push(current * 2024);
  }
  newNumbers = acc;
  const uniqueNumbers = new Set(newNumbers);
  console.log("Unique numbers:", uniqueNumbers.size);
}

console.log(newNumbers.length);

console.timeEnd("execution");
