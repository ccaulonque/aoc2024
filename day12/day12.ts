const path = "../inputs/day12.txt";
const file = Bun.file(path);

const text = await file.text();

const grid = text.split("\n").map((line) => line.split(""));

type Position = {
  x: number;
  y: number;
};

const directions = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
];

const globalAreas = new Map<string, boolean>();

function inspectNeighbours(pos: Position, acc: Set<string> = new Set()) {
  let peri = 0;
  const value = grid[pos.y][pos.x];
  globalAreas.set(JSON.stringify(pos), true);
  acc.add(JSON.stringify(pos));
  for (const direction of directions) {
    const newPos = { x: pos.x + direction.x, y: pos.y + direction.y };
    try {
      if (grid[newPos.y][newPos.x] === value) {
        if (!acc.has(JSON.stringify(newPos))) {
          const [subperi] = inspectNeighbours(newPos, acc);
          peri += subperi;
        }
      } else {
        peri++;
      }
    } catch {
      peri++;
    }
  }
  return [peri, acc.size];
}

let total = 0;

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    const pos = { x, y };
    const done = globalAreas.get(JSON.stringify(pos));
    if (!done) {
      const [peri, area] = inspectNeighbours(pos);
      total += peri * area;
    }
  }
}

console.log(total);
