const path = "../inputs/day10.txt";
const file = Bun.file(path);

const text = await file.text();

const grid: number[][] = text
  .split("\n")
  .map((line) => line.split("").map(Number));

const directions = [
  { x: -1, y: 0 },
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
];

type Position = {
  x: number;
  y: number;
};

function isInGrid(pos: Position): boolean {
  return (
    pos.x >= 0 && pos.x < grid[0].length && pos.y >= 0 && pos.y < grid.length
  );
}

const peaks = new Set<string>();

function explore(
  pos: Position,
  prev?: Position,
  path: Position[] = [],
): number {
  if (!isInGrid(pos)) {
    return 0;
  }
  if (prev && grid[prev.y][prev.x] + 1 !== grid[pos.y][pos.x]) {
    return 0;
  }
  const value = grid[pos.y][pos.x];
  if (value === 9) {
    if (peaks.has(JSON.stringify({ x: pos.x, y: pos.y }))) return 0;
    peaks.add(JSON.stringify({ x: pos.x, y: pos.y }));
    return 1;
  }
  let total = 0;
  for (const dir of directions) {
    const next = {
      x: pos.x + dir.x,
      y: pos.y + dir.y,
    };
    if (prev && next.x === prev.x && next.y === prev.y) {
      continue;
    }
    total += explore(next, pos, [...path, next]);
  }
  return total;
}

let count = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    const elem = grid[y][x];
    if (elem !== 0) {
      continue;
    }
    peaks.clear();
    count += explore({ x, y }, undefined, [{ x, y }]);
  }
}
