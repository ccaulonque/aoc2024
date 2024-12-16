const path = "../inputs/day16.txt";
const file = Bun.file(path);

const text = await file.text();

type Position = {
  x: number;
  y: number;
};

let startPos = { x: 0, y: 0 };

const directions = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

const maze = text.split("\n").map((line, y) =>
  line.split("").map((chara, x) => {
    if (chara === "S") {
      startPos = { x, y };
    }
    return chara;
  }),
);

type State = {
  pos: Position;
  dir: number;
  cost: number;
};

function solve(): number {
  const queue: State[] = [{ pos: startPos, dir: 0, cost: 0 }];
  const visited = new Set<string>();
  let minCost = Infinity;

  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = `${current.pos.x},${current.pos.y},${current.dir}`;

    if (visited.has(key)) continue;
    visited.add(key);

    const value = maze[current.pos.y][current.pos.x];
    if (value === "#") continue;
    if (value === "E") {
      return current.cost;
    }

    for (let i = 0; i < directions.length; i++) {
      const newDir = (current.dir + i) % directions.length;
      const direction = directions[newDir];
      const newPos = {
        x: current.pos.x + direction.x,
        y: current.pos.y + direction.y,
      };

      const newCost = current.cost + (i === 0 ? 1 : 1001);

      queue.push({
        pos: newPos,
        dir: newDir,
        cost: newCost,
      });
    }

    queue.sort((a, b) => a.cost - b.cost);
  }

  return minCost;
}

console.log(solve());
