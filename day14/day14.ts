const path = "../inputs/day14.txt";
const file = Bun.file(path);

const text = await file.text();

const lines = text.split("\n");

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
const WIDTH = 101;
const HEIGHT = 103;
// const TIME_LIMIT = 100;

// 2 + 2*5 = 12
// 4 - 3*5 = -11
// 12 % 11 = 1
// (-11 % 7) = 3

type Position = {
  x: number;
  y: number;
};

const velocitiesMap = new Map<number, Position>();
const positionsMap = new Map<number, Position>();

for (const line of lines) {
  const [posStr, vectorStr] = line.split(" ").map((s) => s.slice(2));
  const pos = posStr.split(",").map(Number);
  const vector = vectorStr.split(",").map(Number);
  velocitiesMap.set(velocitiesMap.size, { x: vector[0], y: vector[1] });
  positionsMap.set(positionsMap.size, { x: pos[0], y: pos[1] });
}

function move(index: number) {
  const pos = positionsMap.get(index);
  const vel = velocitiesMap.get(index);
  if (!pos || !vel) {
    throw new Error("Invalid index");
  }

  const newX = pos.x + vel.x;
  const newY = pos.y + vel.y;

  pos.x = mod(newX, WIDTH);

  pos.y = mod(newY, HEIGHT);
}

for (let i = 0; i < 7000; i++) {
  for (let j = 0; j < positionsMap.size; j++) {
    move(j);
  }
  if (checkIfThereAre31PositionsNextToEachOtherX()) {
    console.log("Found at", i);
    display();
  }
}

// 6875
function checkIfThereAre31PositionsNextToEachOtherX() {
  const grid = Array.from({ length: HEIGHT }, () =>
    Array.from({ length: WIDTH }, () => "."),
  );
  for (const pos of positionsMap.values()) {
    grid[pos.y][pos.x] = "#";
  }

  for (let i = 0; i < HEIGHT; i++) {
    let longestStreak = 0;
    let currentStreak = 0;
    for (let j = 0; j < WIDTH; j++) {
      if (grid[i][j] === "#") {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    if (longestStreak === 31) {
      return true;
    }
  }

  return false;
}

function display() {
  const grid = Array.from({ length: HEIGHT }, () =>
    Array.from({ length: WIDTH }, () => "."),
  );
  for (const pos of positionsMap.values()) {
    grid[pos.y][pos.x] = "#";
  }
  for (const row of grid) {
    console.log(row.join(""));
  }
}
