const path = "../inputs/day16.txt";
const file = Bun.file(path);
const text = await file.text();

type Position = {
  x: number;
  y: number;
};

type State = {
  pos: Position;
  dir: number;
  cost: number;
  path: string[];
};

const directions = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

let startPos = { x: 0, y: 0 };

const maze = text.split("\n").map((line, y) =>
  line.split("").map((chara, x) => {
    if (chara === "S") {
      startPos = { x, y };
    }
    return chara;
  }),
);

function solve(): { minCost: number; paths: string[][] } {
  const queue: State[] = [
    {
      pos: startPos,
      dir: 0,
      cost: 0,
      path: [`${startPos.x},${startPos.y}`],
    },
  ];

  let minCost = Infinity;
  const minPaths: Set<string> = new Set();

  const bestCosts = new Map<string, number>();

  while (queue.length > 0) {
    const current = queue.shift()!;

    const value = maze[current.pos.y][current.pos.x];
    if (value === "#") continue;

    if (value === "E") {
      if (current.cost <= minCost) {
        if (current.cost < minCost) {
          minCost = current.cost;
          minPaths.clear();
        }
        minPaths.add(current.path.join("|"));
      }
      continue;
    }

    for (let i = 0; i < directions.length; i++) {
      const newDir = (current.dir + i) % directions.length;
      const direction = directions[newDir];
      const newPos = {
        x: current.pos.x + direction.x,
        y: current.pos.y + direction.y,
      };

      const newCost = current.cost + (i === 0 ? 1 : 1001);

      const stateKey = `${newPos.x},${newPos.y},${newDir}`;
      const previousBestCost = bestCosts.get(stateKey);

      if (previousBestCost !== undefined && previousBestCost < newCost)
        continue;

      bestCosts.set(stateKey, newCost);

      const newPath = [...current.path, `${newPos.x},${newPos.y}`];
      queue.push({
        pos: newPos,
        dir: newDir,
        cost: newCost,
        path: newPath,
      });
    }

    queue.sort((a, b) => a.cost - b.cost);
  }

  const pathsArray = Array.from(minPaths).map((p) => p.split("|"));

  return { minCost, paths: pathsArray };
}

const result = solve();

const uniqueTiles = new Set<string>();
result.paths.forEach((path) => {
  path.forEach((tile) => {
    uniqueTiles.add(tile);
  });
});

console.log(uniqueTiles.size);
