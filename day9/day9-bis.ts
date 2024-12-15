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

const numberOfFiles = Math.ceil(numbers.length / 2);

function findAvailableSpace(fileSize: number): number {
  loop1: for (let i = 1; i < mapped.length; i++) {
    if (mapped[i] !== null) {
      continue;
    }
    for (let j = 1; j < fileSize; j++) {
      if (mapped[i + j] !== null) {
        i += j;
        continue loop1;
      }
    }
    return i;
  }
  return -1;
}

for (let fileId = numberOfFiles - 1; fileId >= 0; fileId--) {
  const fileSize = numbers[fileId * 2];
  const availableSpace = findAvailableSpace(fileSize);
  if (availableSpace < 0) {
    continue;
  }
  const indexOfFile = mapped.indexOf(fileId);

  if (availableSpace > indexOfFile) {
    continue;
  }
  for (let i = 0; i < fileSize; i++) {
    mapped[availableSpace + i] = fileId;
    mapped[indexOfFile + i] = null;
  }
}

const total = mapped.reduce<number>((acc, current, index) => {
  if (!current) return acc;
  return acc + index * current;
}, 0);

console.log(total);
