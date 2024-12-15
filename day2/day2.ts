const path = "../inputs/day2.txt";
const file = Bun.file(path);

const text = await file.text();

let total = 0;
for (const line of text.split("\n")) {
  if (line) {
    const numbers = line.split(" ").map((n) => parseInt(n));
    const okLine = checkAllLines(numbers);
    if (okLine) {
      total += 1;
    }
  }
}

function checkLine(numbers: number[]): boolean {
  let dir: null | "down" | "up" = null;
  for (let i = 0; i < numbers.length - 1; i++) {
    const diff = numbers[i] - numbers[i + 1];
    if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
      return false;
    }
    const newDir = diff > 0 ? "down" : "up";
    if (dir !== null && newDir !== dir) {
      return false;
    }
    dir = newDir;
  }
  return true;
}

function checkAllLines(numbers: number[]) {
  if (checkLine(numbers)) {
    return true;
  }

  for (let removedIndex = 0; removedIndex < numbers.length; removedIndex++) {
    const newNumbers = numbers.filter((_, i) => i !== removedIndex);
    if (checkLine(newNumbers)) {
      return true;
    }
  }
  return false;
}
